// Single import point for the India dataset. Add new batch files here.

import { indiaOpportunities } from "./opportunities.india";
import { indiaOpportunities2 } from "./opportunities.india2";

export const indiaAll = [...indiaOpportunities, ...indiaOpportunities2];
