const express = require("express");
const Record = require("../models/Record");
const router = express.Router();

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


module.exports = router;
