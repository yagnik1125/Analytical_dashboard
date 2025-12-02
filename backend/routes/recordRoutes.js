const express = require("express");
const Record = require("../models/Record");
const router = express.Router();
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ------------------------------
   Utility: Build Filter Query
--------------------------------*/
const buildQuery = (query) => {
  const q = {};

  const listFilters = ["topic", "sector", "region", "country", "city", "pestle", "source", "swot"];

  listFilters.forEach((key) => {
    if (query[key]) {
      q[key] = { $in: query[key].split(",") }; // multi-select support
    }
  });

  // end_year filter
  if (query.end_year) {
    q.end_year = { $lte: Number(query.end_year) };
  }

  return q;
};

/* ------------------------------
   1) GET ALL RECORDS (with filters & pagination)
--------------------------------*/
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const q = buildQuery(req.query);

    const data = await Record.find(q).skip(skip).limit(limit);
    const total = await Record.countDocuments(q);

    res.json({
      page,
      limit,
      total,
      data,
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});


/* ------------------------------
   Get Filter Options
--------------------------------*/
router.get("/filters", async (req, res) => {
  try {
    const filters = {
      // Core filters requested
      endYears: await Record.distinct("end_year"),
      topics: await Record.distinct("topic"),
      sectors: await Record.distinct("sector"),
      regions: await Record.distinct("region"),
      pestles: await Record.distinct("pestle"),
      sources: await Record.distinct("source"),
      swots: await Record.distinct("swot"),     // NEW — Available in your dataset
      countries: await Record.distinct("country"),
      cities: await Record.distinct("city"),

      // Additional intelligent filters based on dataset fields
      startYears: await Record.distinct("start_year"),
      insightTitles: await Record.distinct("title"),
      likelihoodValues: await Record.distinct("likelihood"),
      relevanceValues: await Record.distinct("relevance"),
      intensityValues: await Record.distinct("intensity"),
      publishedYears: await Record.distinct("published"),  // may be date or year

      // Good for advanced filtering dashboards
      tlds: await Record.distinct("tld"),
      addedDates: await Record.distinct("added"),
      publishedDates: await Record.distinct("published"),
      impactValues: await Record.distinct("impact"),
    };

    // Optional: sort arrays alphabetically / numerically
    Object.keys(filters).forEach((key) => {
      if (Array.isArray(filters[key])) {
        filters[key] = filters[key]
          .filter((v) => v !== "" && v !== null)
          .sort();
      }
    });

    res.json(filters);

  } catch (err) {
    console.error("Filter Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});


const toNum = (field) => ({
  $convert: { input: field, to: "double", onError: 0, onNull: 0 }
});

//-----------------------------------------Correlation Analysis---------------------------------------------------
// GET only numeric fields for correlation charts
router.get("/correlation-data", async (req, res) => {
    try {
        const query = buildQuery(req.query);
        
        const data = await Record.find(query, {
            intensity: 1,
            relevance: 1,
            likelihood: 1,
            _id: 0
        });
        
        res.json(data);
  } catch (err) {
    console.error("Correlation API Error:", err);
    res.status(500).json({ error: "Failed to fetch correlation data" });
}
});

// GET only intensity + relevance for scatter chart
router.get("/scatter-intensity-relevance", async (req, res) => {
    try {
        const query = buildQuery(req.query);
        
        const data = await Record.find(query, {
            intensity: 1,
            relevance: 1,
            _id: 0
        });
        
        res.json(data);
    } catch (err) {
        console.error("Scatter API Error:", err);
    res.status(500).json({ error: "Failed to fetch scatter data" });
}
});

//-----------------------------------------Geographic Analysis---------------------------------------------------
// REGION HEATMAP
router.get("/region-heatmap", async (req, res) => {
    try {
        const query = buildQuery(req.query);
        
        const pipeline = [
            { $match: query },
            {
                $group: {
                    _id: "$region",
                    count: { $sum: 1 },
                    avgIntensity: { $avg: "$intensity" },
                    avgLikelihood: { $avg: "$likelihood" }
                }
            },
            { $sort: { count: -1 } }
        ];
        
        const result = await Record.aggregate(pipeline);
        res.json(result);
    } catch (err) {
        console.error("Region Heatmap Error:", err);
        res.status(500).json({ error: "Failed to load region heatmap data" });
    }
});

// SECTOR BY REGION
router.get("/sector-by-region", async (req, res) => {
    try {
        const query = buildQuery(req.query);
        
        const pipeline = [
            { $match: query },
            {
                $group: {
                    _id: { region: "$region", sector: "$sector" },
                    count: { $sum: 1 },
                }
            },
            {
                $group: {
                    _id: "$_id.region",
                    sectors: {
                        $push: {
                            sector: "$_id.sector",
                            count: "$count"
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ];
        
        const result = await Record.aggregate(pipeline);
        res.json(result);
    } catch (err) {
        console.error("Sector Region Error:", err);
        res.status(500).json({ error: "Failed to load sector-region data" });
    }
});

//Country Stats (Map / Table)
router.get("/country-stats", async (req, res) => {
    try {
        const q = buildQuery(req.query);
        
        const pipeline = [
            { $match: q },
            {
                $group: {
                    _id: "$country",
                    count: { $sum: 1 },
                    avgIntensity: { $avg: "$intensity" },
                    avgLikelihood: { $avg: "$likelihood" },
                },
            },
            { $sort: { count: -1 } },
        ];
        
        const result = await Record.aggregate(pipeline);
        
        res.json(result);
    } catch (err) {
        console.error("Country Stats Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

//-----------------------------------------PESTLE Analysis--------------------------------------------------
// PESTLE Analysis (Bar / Pie / Radar)
router.get("/pestle-analysis", async (req, res) => {
    try {
        const q = buildQuery(req.query);
        
        const pipeline = [
            { $match: q },
            {
                $group: {
                    _id: "$pestle",
                    count: { $sum: 1 },
                    avgIntensity: { $avg: "$intensity" },
                    avgLikelihood: { $avg: "$likelihood" },
                    avgRelevance: { $avg: "$relevance" }
                }
            },
            { $sort: { count: -1 } }
        ];
        
        const result = await Record.aggregate(pipeline);
        res.json(result);
    } catch (err) {
        console.error("PESTLE API Error:", err);
        res.status(500).json({ error: "Failed to load PESTLE analysis" });
    }
});

//-----------------------------------------Risk Analysis--------------------------------------------------
router.get("/risk/high-risk-topics", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const toNum = (field) => ({
      $convert: {
        input: field,
        to: "double",
        onError: 0,
        onNull: 0
      }
    });
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$topic",
          
          avgIntensity: { $avg: toNum("$intensity") },
          avgLikelihood: { $avg: toNum("$likelihood") },
          avgRelevance: { $avg: toNum("$relevance") },
          
          riskScore: {
            $avg: {
              $multiply: [
                toNum("$intensity"),
                toNum("$likelihood"),
                toNum("$relevance")
              ]
            }
          }
        }
      },
      { $sort: { riskScore: -1 } },
      { $limit: 15 }
    ];
    
    const result = await Record.aggregate(pipeline);
    res.json(result);
    
  } catch (err) {
    console.error("HighRiskTopics Error:", err);
    res.status(500).json({ error: "Failed to load high risk topics" });
  }
});

router.get("/risk/likelihood-intensity", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const data = await Record.find(q, {
      intensity: 1,
      likelihood: 1,
      topic: 1,
      country: 1,
      _id: 0
    });
    
    res.json(data);
  } catch (err) {
    console.error("LikelihoodIntensity Error:", err);
    res.status(500).json({ error: "Failed to fetch scatter risk data" });
  }
});

router.get("/risk/matrix", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const data = await Record.find(q, {
      intensity: 1,
      likelihood: 1,
      topic: 1,
      country: 1,
      _id: 0
    });
    
    res.json(data);
  } catch (err) {
    console.error("RiskMatrix Error:", err);
    res.status(500).json({ error: "Failed to fetch risk matrix data" });
  }
});

//-----------------------------------------sector Analysis--------------------------------------------------
router.get("/sector/distribution", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$sector",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ];
    
    const result = await Record.aggregate(pipeline);
    res.json(result);
    
  } catch (err) {
    console.error("Sector Distribution Error:", err);
    res.status(500).json({ error: "Failed to load sector distribution" });
  }
});

router.get("/sector/intensity", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$sector",
          avgIntensity: { $avg: toNum("$intensity") },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgIntensity: -1 } }
    ];
    
    const result = await Record.aggregate(pipeline);
    res.json(result);
    
  } catch (err) {
    console.error("Sector Intensity Error:", err);
    res.status(500).json({ error: "Failed to load sector intensity" });
  }
});

router.get("/sector/likelihood", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$sector",
          avgLikelihood: { $avg: toNum("$likelihood") },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgLikelihood: -1 } }
    ];
    
    const result = await Record.aggregate(pipeline);
    res.json(result);
    
  } catch (err) {
    console.error("Sector Likelihood Error:", err);
    res.status(500).json({ error: "Failed to load sector likelihood" });
  }
});

//-----------------------------------------Source Analysis--------------------------------------------------
router.get("/source/distribution", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$source",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ];
    
    const result = await Record.aggregate(pipeline);
    res.json(result);
    
  } catch (err) {
    console.error("Source Distribution Error:", err);
    res.status(500).json({ error: "Failed to load source distribution" });
  }
});

router.get("/source/intensity", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$source",
          avgIntensity: { $avg: toNum("$intensity") },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgIntensity: -1 } }
    ];
    
    const result = await Record.aggregate(pipeline);
    res.json(result);
    
  } catch (err) {
    console.error("Source Intensity Error:", err);
    res.status(500).json({ error: "Failed to load source intensity" });
  }
});

router.get("/source/likelihood", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$source",
          avgLikelihood: { $avg: toNum("$likelihood") },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgLikelihood: -1 } }
    ];
    
    const result = await Record.aggregate(pipeline);
    res.json(result);
    
  } catch (err) {
    console.error("Source Likelihood Error:", err);
    res.status(500).json({ error: "Failed to load source likelihood" });
  }
});

//-----------------------------------------Summary--------------------------------------------------
router.get("/summary/missing-data", async (req, res) => {
  try {
    const fields = [
      "intensity",
      "likelihood",
      "relevance",
      "topic",
      "sector",
      "region",
      "country",
      "pestle",
      "source",
      "start_year",
      "end_year"
    ];
    
    const pipeline = [
      {
        $group: {
          _id: null,
          ...Object.fromEntries(
            fields.map(f => [
              `missing_${f}`,
              {
                $sum: {
                  $cond: [
                    { $or: [{ $eq: [`$${f}`, null] }, { $eq: [`$${f}`, ""] }] },
                    1,
                    0
                  ]
                }
              }
            ])
          ),
          total: { $sum: 1 }
        }
      }
    ];
    
    const result = await Record.aggregate(pipeline);
    res.json(result[0] || {});
    
  } catch (err) {
    console.error("MissingData Error:", err);
    res.status(500).json({ error: "Failed to load missing data stats" });
  }
});

router.get("/summary/kpis", async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          avgIntensity: { $avg: { $convert: { input: "$intensity", to: "double", onError: 0, onNull: 0 }}},
          avgLikelihood: { $avg: { $convert: { input: "$likelihood", to: "double", onError: 0, onNull: 0 }}},
          avgRelevance: { $avg: { $convert: { input: "$relevance", to: "double", onError: 0, onNull: 0 }}},
          uniqueTopics: { $addToSet: "$topic" },
          uniqueCountries: { $addToSet: "$country" },
          uniqueSources: { $addToSet: "$source" },
        }
      }
    ];
    
    const r = await Record.aggregate(pipeline);
    const data = r[0];
    
    res.json({
      totalRecords: data.totalRecords,
      avgIntensity: data.avgIntensity,
      avgLikelihood: data.avgLikelihood,
      avgRelevance: data.avgRelevance,
      totalTopics: data.uniqueTopics.filter(Boolean).length,
      totalCountries: data.uniqueCountries.filter(Boolean).length,
      totalSources: data.uniqueSources.filter(Boolean).length
    });
    
  } catch (err) {
    console.error("KPIs Error:", err);
    res.status(500).json({ error: "Failed to load KPIs" });
  }
});

//-----------------------------------------time--------------------------------------------------
router.get("/time/insights-per-year", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$end_year",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];
    
    const result = await Record.aggregate(pipeline);
    res.json(result);
    
  } catch (err) {
    console.error("InsightsPerYear Error:", err);
    res.status(500).json({ error: "Failed to load insights per year" });
  }
});

router.get("/time/intensity-by-year", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$end_year",
          avgIntensity: { 
            $avg: { $convert: { input: "$intensity", to: "double", onError: 0, onNull: 0 }} 
          },
          totalIntensity: { 
            $sum: { $convert: { input: "$intensity", to: "double", onError: 0, onNull: 0 }} 
          }
        }
      },
      { $sort: { _id: 1 } }
    ];
    
    const result = await Record.aggregate(pipeline);
    res.json(result);
    
  } catch (err) {
    console.error("IntensityByYear Error:", err);
    res.status(500).json({ error: "Failed to load intensity by year" });
  }
});

router.get("/time/relevance-over-years", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$end_year",
          avgRelevance: { 
            $avg: { $convert: { input: "$relevance", to: "double", onError: 0, onNull: 0 }}
          }
        }
      },
      { $sort: { _id: 1 } }
    ];
    
    const result = await Record.aggregate(pipeline);
    res.json(result);
    
  } catch (err) {
    console.error("RelevanceYears Error:", err);
    res.status(500).json({ error: "Failed to load relevance over years" });
  }
});
//-----------------------------------------topic--------------------------------------------------
router.get("/topic/intensity", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$topic",
          avgIntensity: {
            $avg: {
              $convert: { input: "$intensity", to: "double", onError: 0, onNull: 0 }
            }
          }
        }
      },
      { $sort: { avgIntensity: -1 } }
    ];
    
    const result = await Record.aggregate(pipeline);
    
    res.json(result);
  } catch (err) {
    console.error("TopicIntensity Error:", err);
    res.status(500).json({ error: "Failed to load topic intensity" });
  }
});

router.get("/topic/likelihood", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$topic",
          avgLikelihood: {
            $avg: {
              $convert: { input: "$likelihood", to: "double", onError: 0, onNull: 0 }
            }
          }
        }
      },
      { $sort: { avgLikelihood: -1 } }
    ];
    
    const result = await Record.aggregate(pipeline);
    
    res.json(result);
  } catch (err) {
    console.error("TopicLikelihood Error:", err);
    res.status(500).json({ error: "Failed to load topic likelihood" });
  }
});

router.get("/topic/top", async (req, res) => {
  try {
    const q = buildQuery(req.query);
    const limit = Number(req.query.limit) || 10;
    
    const pipeline = [
      { $match: q },
      {
        $group: {
          _id: "$topic",
          count: { $sum: 1 },
          avgIntensity: {
            $avg: {
              $convert: { input: "$intensity", to: "double", onError: 0, onNull: 0 }
            }
          },
          avgLikelihood: {
            $avg: {
              $convert: { input: "$likelihood", to: "double", onError: 0, onNull: 0 }
            }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ];
    
    const result = await Record.aggregate(pipeline);
    
    res.json(result);
  } catch (err) {
    console.error("TopTopics Error:", err);
    res.status(500).json({ error: "Failed to load top topics" });
  }
});
//-----------------------------------------ai summary--------------------------------------------------
// ---- helper functions ----
const toNumber = (v) => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a,b)=>a+b,0) / arr.length;
}

function pearson(x,y){
  if(x.length<3||x.length!==y.length)return 0;
  const mX=x.reduce((a,b)=>a+b,0)/x.length,mY=y.reduce((a,b)=>a+b,0)/y.length;
  let num=0,sx=0,sy=0;
  for(let i=0;i<x.length;i++){
    const dx=x[i]-mX,dy=y[i]-mY;
    num+=dx*dy; sx+=dx*dx; sy+=dy*dy;
  }
  return num/Math.sqrt(sx*sy||1);
}

function groupBy(docs = [], field, limit = 0) {
  const map = new Map();
  for (const d of docs) {
    const raw = d[field];
    // normalize empty strings / nulls
    const key = (raw === undefined || raw === null || raw === "") ? "Unknown" : String(raw);
    map.set(key, (map.get(key) || 0) + 1);
  }

  // create array
  const arr = Array.from(map.entries()).map(([k, count]) => ({ key: k, count }));

  // heuristics: if keys look numeric (all numeric when parseable), sort by numeric key asc
  const numericKeys = arr.every(item => !Number.isNaN(Number(item.key)) && item.key !== "Unknown");
  if (numericKeys) {
    arr.sort((a, b) => Number(a.key) - Number(b.key));
  } else {
    arr.sort((a, b) => b.count - a.count);
  }

  return limit > 0 ? arr.slice(0, limit) : arr;
}

function avgBy(docs = [], groupField, valueField) {
  const sums = new Map();
  const counts = new Map();

  for (const d of docs) {
    const rawKey = (d[groupField] === undefined || d[groupField] === null || d[groupField] === "") ? "Unknown" : String(d[groupField]);
    const val = toNumber(d[valueField]);

    sums.set(rawKey, (sums.get(rawKey) || 0) + val);
    counts.set(rawKey, (counts.get(rawKey) || 0) + 1);
  }

  const arr = Array.from(sums.keys()).map((k) => {
    const sum = sums.get(k);
    const count = counts.get(k);
    const avg = count ? +(sum / count).toFixed(2) : 0;
    return { key: k, avg, count };
  });

  // sort by avg desc (most "intense" first), fallback to count
  arr.sort((a, b) => {
    if (b.avg === a.avg) return b.count - a.count;
    return b.avg - a.avg;
  });

  return arr;
}

function crossGroup(docs = [], key1, key2) {
  const outer = new Map();

  for (const d of docs) {
    const k1Raw = (d[key1] === undefined || d[key1] === null || d[key1] === "") ? "Unknown" : String(d[key1]);
    const k2Raw = (d[key2] === undefined || d[key2] === null || d[key2] === "") ? "Unknown" : String(d[key2]);

    if (!outer.has(k1Raw)) outer.set(k1Raw, new Map());
    const inner = outer.get(k1Raw);
    inner.set(k2Raw, (inner.get(k2Raw) || 0) + 1);
  }

  const result = {};
  for (const [k1, innerMap] of outer.entries()) {
    const arr = Array.from(innerMap.entries()).map(([k2, count]) => ({ key: k2, count }));
    arr.sort((a, b) => b.count - a.count);
    result[k1] = arr;
  }

  return result;
}

function topBy(docs = [], field, n = 10) {
  if (!docs || docs.length === 0) return [];

  // detect numeric field presence
  const numericSample = docs.find(d => d[field] !== undefined && d[field] !== null);
  const isNumeric = numericSample && !Number.isNaN(Number(numericSample[field]));

  if (isNumeric) {
    const sorted = [...docs].sort((a, b) => toNumber(b[field]) - toNumber(a[field]));
    return sorted.slice(0, n).map(d => ({
      topic: d.topic || null,
      country: d.country || null,
      [field]: toNumber(d[field]),
      intensity: toNumber(d.intensity),
      likelihood: toNumber(d.likelihood),
      relevance: toNumber(d.relevance)
    }));
  } else {
    // group by the field and return counts
    const grouped = groupBy(docs, field);
    return grouped.slice(0, n).map(g => ({ key: g.key, count: g.count }));
  }
}

function getScatter(docs = []) {
  return docs.map(d => ({
    x: toNumber(d.intensity),
    y: toNumber(d.relevance),
    size: toNumber(d.likelihood),
    topic: d.topic || null,
    country: d.country || null
  })).filter(p => (p.x !== 0 || p.y !== 0)); // optionally drop zero-zero points
}

router.post("/summary", async (req,res)=>{
  try{
    const { filters = {}, mode="local" } = req.body;
    const q = buildQuery(filters);

    // ============ DATABASE AGGREGATION ============
    const data = await Promise.all([
      Record.aggregate([{ $match:q },{ $group:{_id:null,total:{$sum:1},ai:{$avg:"$intensity"},al:{$avg:"$likelihood"},ar:{$avg:"$relevance"}} }]),
      Record.aggregate([{ $match:q },{ $group:{_id:"$topic",count:{$sum:1}}},{ $sort:{count:-1} },{ $limit:5 }]),
      Record.aggregate([{ $match:q },{ $group:{_id:"$country",count:{$sum:1}}},{ $sort:{count:-1} },{ $limit:5 }]),
      Record.find(q,{"intensity":1,"relevance":1,"likelihood":1}).limit(4000)
    ]);

    const overview= data[0]?.[0]||{};
    const topTopics = data[1];
    const topCountries = data[2];
    const docs = data[3];
    const i=docs.map(d=>d.intensity||0), r=docs.map(d=>d.relevance||0), l=docs.map(d=>d.likelihood||0);

    const localSummary = {
      totalRecords: overview.total,
      avgIntensity:+overview.ai?.toFixed(2)||0,
      avgLikelihood:+overview.al?.toFixed(2)||0,
      avgRelevance:+overview.ar?.toFixed(2)||0,
      topTopics, topCountries,
      correlations:{
        intensity_relevance:+pearson(i,r).toFixed(3),
        intensity_likelihood:+pearson(i,l).toFixed(3),
        relevance_likelihood:+pearson(r,l).toFixed(3)
      }
    };

    // Return local summary only
    if(mode==="local") return res.json({ localSummary });

    // ============= GROQ AI GENERATION ==============
    if(!process.env.GROQ_API_KEY)
      return res.json({ localSummary, ai:null, message:"Missing GROQ_API_KEY" });

    const context = `
      Dataset Summary:
      Records: ${localSummary.totalRecords}
      Avg Intensity: ${localSummary.avgIntensity}
      Avg Likelihood: ${localSummary.avgLikelihood}
      Avg Relevance: ${localSummary.avgRelevance}
      Top Topics: ${topTopics.map(t=>`${t._id}(${t.count})`).join(", ")}
      Top Countries: ${topCountries.map(c=>`${c._id}(${c.count})`).join(", ")}
      Correlations: IR=${localSummary.correlations.intensity_relevance}, IL=${localSummary.correlations.intensity_likelihood}, RL=${localSummary.correlations.relevance_likelihood}
      `;

    const aiRes=await groq.chat.completions.create({
      model:"llama-3.1-8b-instant",
      messages:[{
        role:"system",
        content:"You are a top-tier analytics expert. Generate sharp business insights."
      },{
        role:"user",
        content:`Analyse the dataset and generate:
        1. Executive Summary (3 sentences)
        2. Top 5 Actionable Insights
        3. Patterns & Correlations
        4. Business Recommendations
        5. Risk or Data Warning Signals

        Context:\n${context}`
      }],
      temperature:0.2,
      max_tokens:700
    });

    const aiSummary = aiRes.choices[0]?.message?.content || null;

    return res.json({ localSummary, aiSummary });

  }catch(err){
    console.error(err);
    res.status(500).json({error:"AI Summary Engine Failed"});
  }
});

// ============ Universal Analytics Engine ============
function compressInsights(insights,page){
  const clone = {...insights};

  // limit large objects
  const MAX_ITEMS = 15;  // adjust as needed

  for(const key in clone){
    const val = clone[key];

    if(Array.isArray(val) && val.length > MAX_ITEMS){
      clone[key] = val.slice(0, MAX_ITEMS);
    }

    // If nested map-like objects
    if(typeof val === "object" && !Array.isArray(val)){
      const keys = Object.keys(val);
      if(keys.length > MAX_ITEMS){
        const trimmed = keys.slice(0,MAX_ITEMS);
        clone[key] = trimmed.reduce((acc,k)=>{
          acc[k] = val[k];
          return acc;
        },{});
      }
    }
  }

  return clone;
}

router.post("/page-summary", async (req,res)=>{
  try{
    const { filters={}, page } = req.body;
    const q = buildQuery(filters);

    // --- COMMON DATA FETCH ---
    const docs = await Record.find(q).limit(6000);
    const intensity = docs.map(d=>d.intensity||0);
    const likelihood = docs.map(d=>d.likelihood||0);
    const relevance = docs.map(d=>d.relevance||0);

    const readableLabels = {
      intensity: "Intensity (How strong the impact or effect is)",
      likelihood: "Likelihood (How probable an event or risk is)",
      relevance: "Relevance (How closely it relates to core business areas)",
      corr_ir: "Intensity ↔ Relevance",
      corr_il: "Intensity ↔ Likelihood",
      corr_rl: "Relevance ↔ Likelihood"
    };

    function translateInsights(insights){
      return JSON.stringify(insights, (key,value)=>{
        if(readableLabels[key]) return `${value}  <-- ${readableLabels[key]}`;
        return value;
      },2);
    }

    // PAGE-SPECIFIC SUMMARIES
    let insights = {};

    switch(page){

      case "dashboard":
        insights = {
          yearlyCount: groupBy(docs,"year"),
          pestleSplit: groupBy(docs,"pestle"),
          sectorSpread: groupBy(docs,"sector")
        };
        break;

      case "correlation":
        insights = {
          corr_ir: pearson(intensity,relevance),
          corr_il: pearson(intensity,likelihood),
          corr_rl: pearson(relevance,likelihood)
        };
        break;

      case "risk":
        insights = {
          highRisk: topBy(docs,"intensity",10),
          scatterDistribution: getScatter(docs)
        };
        break;

      case "geographic":
        insights = {
          byCountry: groupBy(docs,"country"),
          byRegion: groupBy(docs,"region"),
          sectorRegion: crossGroup(docs,"region","sector")
        };
        break;

      case "pestle":
        insights = {
          distribution: groupBy(docs,"pestle"),
          avgIntensity: avgBy(docs,"pestle","intensity"),
          avgLikelihood: avgBy(docs,"pestle","likelihood")
        };
        break;

      case "time":
        insights = {
          insightsPerYear: groupBy(docs,"year"),
          intensityTrend: avgBy(docs,"year","intensity"),
          relevanceTrend: avgBy(docs,"year","relevance")
        };
        break;

      case "topic":
        insights = {
          topTopics: groupBy(docs,"topic"),
          topicIntensity: avgBy(docs,"topic","intensity"),
          topicLikelihood: avgBy(docs,"topic","likelihood")
        };
        break;

      default:
        insights = { message:"Unknown page type" };
    }

    const compressed = compressInsights(insights, page);

    // AI summary (More natural, human-style narrative)
    const aiRes = await groq.chat.completions.create({
      model:"llama-3.1-8b-instant",
      messages:[
        {
          role:"system",
          content:`You are a senior data analyst who translates numbers into plain English.
          You never use variable names like 'ir' or 'rl'.
          Instead use human words:
          - intensity → "risk intensity" or "impact severity"
          - likelihood → probability or "chance of occurrence"
          - relevance → business relevance
          - corr_ir → correlation between intensity and relevance
          - corr_il → correlation between intensity and likelihood
          - corr_rl → correlation between relevance and likelihood

          Speak like you're briefing a manager.
          No technical jargon unless necessary.
          No bullet-only output — write in flowing paragraphs.`
        },
        {
          role:"user",
          content:`Page: ${page}
          Filters Applied: ${JSON.stringify(filters,null,2)}
          Insights (compressed): ${JSON.stringify(compressed)}

          Write a human-friendly narrative with sections:

          ### Overview
          A 3-6 sentence smooth summary that even a non-technical person can understand.

          ### What the patterns suggest
          Describe relationships in everyday words (e.g. "higher intensity events tend to also be more relevant").

          ### Risks & Opportunities
          Explain what could go wrong OR what can be leveraged, written like a practical business suggestion.

          ### Recommended next actions
          2-4 guiding steps in plain English.

          IMPORTANT:
          Do not use variable names (ir/il/rl).
          Always translate to meaningful terms.`
        }
      ]
    });

    res.json({
      page,
      insights,
      aiSummary: aiRes.choices[0]?.message?.content
    });

  }catch(err){
    console.error(err);
    res.status(500).json({error:"Summary generation failed"});
  }
});

router.post("/chat-analytics", async (req, res) => {
  try {
    const { message, filters = {}, page = "dashboard", history = [] } = req.body;

    // Build DB query & fetch docs
    const q = buildQuery(filters);
    const docs = await Record.find(q).limit(5000);

    // Extract numbers
    const intensity = docs.map(d => d.intensity || 0);
    const likelihood = docs.map(d => d.likelihood || 0);
    const relevance = docs.map(d => d.relevance || 0);

    // Core computed insights (common for chatbot)
    const computed = {
      count: docs.length,
      avgIntensity: avg(intensity),
      avgLikelihood: avg(likelihood),
      avgRelevance: avg(relevance),
      corr_ir: pearson(intensity, relevance),
      corr_il: pearson(intensity, likelihood),
      corr_rl: pearson(relevance, likelihood),
      topSectors: groupBy(docs, "sector"),
      topCountries: groupBy(docs, "country"),
      timeTrend: avgBy(docs, "year", "intensity")
    };

    const compressed = compressInsights(computed, page);

    // Build conversation messages
    const chatMessages = [
      {
        role: "system",
        content: `
        You are an expert data analyst chatbot.
        Your job is to explain insights in simple English.
        - ALWAYS be conversational like ChatGPT.
        - ALWAYS explain with numbers from the dataset when relevant.
        - Translate:
          intensity → risk intensity
          likelihood → chance of occurrence
          relevance → business relevance
        - You can perform reasoning based on the provided dataset insights.
        `
      },
      ...history,
      {
        role: "user",
        content: `
        User Message: "${message}"

        Filters: ${JSON.stringify(filters, null, 2)}
        Insights Snapshot: ${JSON.stringify(compressed, null, 2)}

        Using these insights, answer like a professional analyst.`
      }
    ];

    // console.log("Chat Messages:", chatMessages);

    // GROQ API call
    const aiRes = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: chatMessages
    });

    const reply = aiRes.choices[0]?.message?.content || "Unable to generate response.";

    res.json({
      reply,
      computed,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat analytics failed" });
  }
});

module.exports = router;
