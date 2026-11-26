import config from "./stylelint.config.mjs";

export default {
  plugins: [
    "stylelint-order",
    "./stylelint-rules/prefer-background-color.mjs"
  ],

  rules: {
    "order/properties-order": config.rules["order/properties-order"],
    "custom/prefer-background-color":
      config.rules["custom/prefer-background-color"],

    "rule-empty-line-before": [
      "always",
      {
        except: ["first-nested"]
      }
    ],

    "at-rule-empty-line-before": [
      "always",
      {
        except: ["first-nested"],
        ignoreAtRules: ["import", "charset"]
      }
    ]
  }
};
