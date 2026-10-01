# ATDIF: Adaptive Trust Decision Intelligence Framework

## 1. Overview

In industrial mining operations, blindly relying on point predictions can lead to incorrect thermal coal grading, boiler damage, contract penalties, or washed coal rejects.

The **Adaptive Trust Decision Intelligence Framework (ATDIF)** acts as an autonomous gating layer between raw machine learning inference and downstream dispatch/commercial decisions.

---

## 2. Confidence Formulation

Unlike naive systems that output random numbers or constant confidence scores, ATDIF calculates a normalized confidence score $C \in [0.0, 1.0]$ based on five quantitative vectors:

$$C = w_1 \cdot S_{\text{dist}} + w_2 \cdot S_{\text{drift}} + w_3 \cdot S_{\text{comp}} + w_4 \cdot S_{\text{prox}} + w_5 \cdot S_{\text{uncert}}$$

1. **Multivariate Distribution Proximity ($S_{\text{dist}}$)**:
   Measures normalized Euclidean distance from the input sample to the training data centroid in standardized feature space. Samples in low-density training regions receive lower stability scores.
2. **Domain & Feature Drift ($S_{\text{drift}}$)**:
   Checks whether geophysical sensor values (e.g. gamma ray, bulk density) fall outside operational 3-sigma mining bounds.
3. **Input Completeness ($S_{\text{comp}}$)**:
   Ratios available sensor telemetry vs missing/imputed feature fields.
4. **Physical Proximate Consistency ($S_{\text{prox}}$)**:
   Verifies that proximate mass balances obey physical conservation laws:
   $$\text{Moisture} + \text{Ash} + \text{Volatile Matter} + \text{Fixed Carbon} \approx 100\%$$
   High discrepancies indicate uncalibrated sensor inputs.
5. **Model Uncertainty / Ensemble Variance ($S_{\text{uncert}}$)**:
   Quantifies localized tree prediction spread across sub-estimators.

---

## 3. Decision Boundary & Laboratory Feedback Loop

- **Confidence Threshold**: Configurable via `CONFIDENCE_THRESHOLD=0.85` (default: 85%).
- **If $C \ge 0.85$**:
  - Decision: `HIGH CONFIDENCE — VERIFIED AI`
  - Action: Sample authorized for direct OR-Tools blend optimization and utility consignment dispatch.
- **If $C < 0.85$**:
  - Decision: `LOW CONFIDENCE — LABORATORY VERIFICATION REQUIRED`
  - Action: System automatically enqueues a `verification_request` in MongoDB and marks the sample as unverified. Dispatch is restricted until a certified lab technician conducts ISO bomb calorimetry and enters ground-truth feedback.
