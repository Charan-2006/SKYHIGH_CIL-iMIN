# Google OR-Tools Coal Blend Optimization

## 1. Mathematical Formulation

Coal blending is formulated as a Continuous Linear Programming (LP) problem solved with **Google OR-Tools GLOP**:

### Decision Variables
Let $x_i \ge 0$ denote the metric tons of coal allocated from source mine $i \in \{1, \dots, N\}$.

### Objective Function
Depending on user selection:

1. **Minimize Total Cost**:
   $$\min \sum_{i=1}^N c_i \cdot x_i$$
2. **Maximize Thermal Quality (GCV)**:
   $$\max \sum_{i=1}^N \text{GCV}_i \cdot x_i$$
3. **Minimize Target Deviation**:
   $$\min | \sum_{i=1}^N \text{GCV}_i \cdot x_i - \text{GCV}_{\text{target}} \cdot Q_{\text{target}} |$$

### Constraints
1. **Total Tonnage Balance**:
   $$\sum_{i=1}^N x_i = Q_{\text{target}}$$
2. **Available Mine Stock Limit**:
   $$0 \le x_i \le \text{AvailableQuantity}_i, \quad \forall i$$
3. **Target GCV Satisfaction**:
   $$\sum_{i=1}^N \text{GCV}_i \cdot x_i \ge \text{GCV}_{\text{target}} \cdot Q_{\text{target}}$$
4. **Maximum Allowable Ash Cap**:
   $$\sum_{i=1}^N \text{Ash}_i \cdot x_i \le \text{Ash}_{\text{max}} \cdot Q_{\text{target}}$$
5. **Maximum Allowable Moisture Cap**:
   $$\sum_{i=1}^N \text{Moisture}_i \cdot x_i \le \text{Moisture}_{\text{max}} \cdot Q_{\text{target}}$$

---

## 2. Real Solver Output & Infeasibility Handling

If no blend combination can physically satisfy the constraints (e.g. target GCV is higher than all available sources, or required ash limit is too low):
- The solver status returns `INFEASIBLE`.
- The system returns `feasibility: false`.
- The UI displays: *"No feasible blend found for target constraints (solver status: INFEASIBLE)"* rather than generating fake or interpolated ratios.
