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

const responseSchema = z.object({
  success: z.boolean(),

  data: z.object({
    title: z.string(),

    summary: z.string(),

    sections: z.array(
      z.object({
        type: z.enum([
          "metrics",
          "table",
          "pie_chart",
          "bar_chart",
          "line_chart",
          "comparison",
          "insight",
          "warning",
          "recommendation",
          "text",
        ]),

        title: z.string(),

        data: z.any(),
      })
    ),
  }),

  error: z.null(),
});


module.exports = {
  responseSchema,
};