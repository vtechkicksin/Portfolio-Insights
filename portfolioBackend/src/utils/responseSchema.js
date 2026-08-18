const { z } = require("zod");


const metricSchema = z.object({
  label: z.string(),
  value: z.number(),
  formattedValue: z.string(),
});

const tableSchema = z.object({
  columns: z.array(z.string()),
  rows: z.array(z.array(z.any())),
});

const chartDataSchema = z.object({
  label: z.string(),
  value: z.number(),
});

const insightSchema = z.object({
  severity: z.enum(["info", "success", "warning", "danger"]),
  description: z.string(),
});

const recommendationSchema = z.object({
  description: z.string(),
});


// --------------------------------------------------
// 2. Section schemas
// --------------------------------------------------

const metricsSection = z.object({
  type: z.literal("metrics"),
  title: z.string(),
  data: z.array(metricSchema),
});

const tableSection = z.object({
  type: z.literal("table"),
  title: z.string(),
  data: tableSchema,
});

const pieChartSection = z.object({
  type: z.literal("pie_chart"),
  title: z.string(),
  data: z.array(chartDataSchema),
});

const barChartSection = z.object({
  type: z.literal("bar_chart"),
  title: z.string(),
  data: z.array(chartDataSchema),
});

const lineChartSection = z.object({
  type: z.literal("line_chart"),
  title: z.string(),
  data: z.array(chartDataSchema),
});

const comparisonSection = z.object({
  type: z.literal("comparison"),
  title: z.string(),
  data: z.object({
    items: z.array(
      z.object({
        label: z.string(),
        value: z.number(),
        formattedValue: z.string(),
      })
    ),
  }),
});

const insightSection = z.object({
  type: z.literal("insight"),
  title: z.string(),
  data: insightSchema,
});

const warningSection = z.object({
  type: z.literal("warning"),
  title: z.string(),
  data: z.object({
    description: z.string(),
  }),
});

const recommendationSection = z.object({
  type: z.literal("recommendation"),
  title: z.string(),
  data: recommendationSchema,
});

const textSection = z.object({
  type: z.literal("text"),
  title: z.string(),
  data: z.object({
    content: z.string(),
  }),
});


const responseSchema = z.object({
  success: z.boolean(),

  data: z.object({
    title: z.string(),

    summary: z.string(),

    sections: z.array(
      z.discriminatedUnion("type", [
        metricsSection,
        tableSection,
        pieChartSection,
        barChartSection,
        lineChartSection,
        comparisonSection,
        insightSection,
        warningSection,
        recommendationSection,
        textSection,
      ])
    ),
  }),

  error: z.null(),
});


module.exports = {
  responseSchema,
};