import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    layout(
      "routes/form-layout/layout.tsx",
      prefix(":layoutId", [
        index("routes/form-layout/index.tsx"),
        // Fields
        route("fields/create", "routes/form-layout/fields/create.tsx"),
        route("fields/:fieldId/delete", "routes/form-layout/fields/delete.tsx"),
        route(
          "fields/:fieldId/rules/create",
          "routes/form-layout/fields/rules/create.tsx",
        ),
        route(
          "fields/:fieldId/rules/:ruleId/delete",
          "routes/form-layout/fields/rules/delete.tsx",
        ),
        // Submission
        route(
          "submissions/create",
          "routes/form-layout/submissions/create.tsx",
        ),
      ]),
    ),
  ]),
] satisfies RouteConfig;
