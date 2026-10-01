import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

"""
CARBONCORTEX SYNTHETIC COAL DATA GENERATOR
Notice: Demo Environment — Synthetic Dataset
This dataset generates realistic physical relationships between geological depth,
stratigraphy, sensor geophysics, proximate analysis, and Gross Calorific Value (GCV).
"""

MINES_INFO = [
    {"name": "Moonidih Underground", "subsidiary": "BCCL", "state": "Jharkhand", "coalfield": "Jharia", "sub_num": 1, "base_gcv": 6450, "base_ash": 13.0},
    {"name": "Sonalpur Open Cast", "subsidiary": "ECL", "state": "West Bengal", "coalfield": "Raniganj", "sub_num": 2, "base_gcv": 6120, "base_ash": 15.0},
    {"name": "Piparwar Mega Project", "subsidiary": "CCL", "state": "Jharkhand", "coalfield": "North Karanpura", "sub_num": 3, "base_gcv": 5800, "base_ash": 19.5},
    {"name": "Jayant Open Cast", "subsidiary": "NCL", "state": "Madhya Pradesh", "coalfield": "Singrauli", "sub_num": 4, "base_gcv": 5380, "base_ash": 23.0},
    {"name": "Padmapur Deep OCP", "subsidiary": "WCL", "state": "Maharashtra", "coalfield": "Wardha Valley", "sub_num": 5, "base_gcv": 5150, "base_ash": 26.5},
    {"name": "Gevra Mega Project", "subsidiary": "SECL", "state": "Chhattisgarh", "coalfield": "Korba", "sub_num": 6, "base_gcv": 4920, "base_ash": 28.5},
    {"name": "Lakhanpur Open Cast", "subsidiary": "MCL", "state": "Odisha", "coalfield": "Ib Valley", "sub_num": 7, "base_gcv": 4720, "base_ash": 31.0},
    {"name": "Tikak Open Cast", "subsidiary": "NEC", "state": "Assam", "coalfield": "Makum", "sub_num": 8, "base_gcv": 6750, "base_ash": 11.5}
]

SEAMS = ["SEAM-I", "SEAM-II", "SEAM-III", "SEAM-IV", "SEAM-V", "SEAM-VI", "SEAM-VII", "SEAM-VIII"]

def generate_synthetic_dataset(num_samples: int = 6000, output_dir: str = "./data/synthetic"):
    np.random.seed(42)
    os.makedirs(output_dir, exist_ok=True)
    records = []

    start_date = datetime(2025, 1, 1)

    for i in range(num_samples):
        mine = np.random.choice(MINES_INFO)
        seam_idx = np.random.randint(1, len(SEAMS) + 1)
        seam_name = SEAMS[seam_idx - 1]
        
        # Depth varies from 30m to 350m
        depth = np.random.uniform(30.0, 320.0)
        seam_thickness = np.random.uniform(2.0, 18.0)
        overburden = depth * np.random.uniform(0.65, 0.85)

        # Geological and rock mechanics features
        strata_density = np.random.uniform(2.1, 2.7)
        core_recovery = np.random.uniform(80.0, 98.5)
        sandstone_shale = np.random.uniform(0.8, 3.5)

        # Drilling telemetry
        drilling_rate = np.random.uniform(15.0, 45.0)
        cutting_resistance = np.random.uniform(25.0, 65.0)

        # Geophysical spectral wireline sensor telemetry
        # Higher ash correlates with higher spectral gamma ray & bulk density
        ash_nominal = mine["base_ash"] + np.random.normal(0, 3.5) + (depth * 0.015)
        ash = float(np.clip(ash_nominal, 8.0, 52.0))

        gamma_ray = 40.0 + (ash * 1.8) + np.random.normal(0, 5)
        resistivity = 220.0 - (ash * 2.5) + np.random.normal(0, 10)
        bulk_density = 1.25 + (ash * 0.009) + np.random.normal(0, 0.02)
        optical_reflectance = 0.65 + (depth * 0.0018) + np.random.normal(0, 0.05)

        # Moisture (seasonal & mine dependent)
        moisture = float(np.clip(np.random.uniform(2.5, 9.5) + (3.0 if i % 12 in [5, 6, 7] else 0.0), 1.5, 18.0))
        
        # Volatile Matter
        vm = float(np.clip(38.0 - (depth * 0.03) + np.random.normal(0, 2.5), 18.0, 42.0))
        
        # Fixed Carbon by mass balance: 100 - (Ash + Moisture + VM)
        fixed_carbon = float(np.clip(100.0 - (ash + moisture + vm), 22.0, 68.0))
        # Re-normalize to ensure exact 100% proximate balance
        total_p = ash + moisture + vm + fixed_carbon
        ash = round((ash / total_p) * 100.0, 2)
        moisture = round((moisture / total_p) * 100.0, 2)
        vm = round((vm / total_p) * 100.0, 2)
        fixed_carbon = round(100.0 - (ash + moisture + vm), 2)

        # Physical Gross Calorific Value (GCV kcal/kg)
        # Baseline formula for Indian coals: Pure coal carbon combustible yields ~8250 kcal/kg,
        # with thermal deductions for incombustible mineral matter (ash) and latent heat of moisture.
        gcv_raw = 8250 - (88.0 * ash) - (74.0 * moisture) + (5.5 * fixed_carbon) + np.random.normal(0, 75)
        gcv = float(round(np.clip(gcv_raw, 2400.0, 7600.0), 1))

        # Sample code and timestamp
        sample_code = f"CCX-SYN-{i+1:05d}"
        sample_date = start_date + timedelta(days=int(i * (365 / num_samples)), hours=int(np.random.randint(0, 24)))

        records.append({
            "sample_code": sample_code,
            "mine_name": mine["name"],
            "subsidiary": mine["subsidiary"],
            "state": mine["state"],
            "coalfield": mine["coalfield"],
            "seam": seam_name,
            "depth": round(depth, 1),
            "seam_thickness": round(seam_thickness, 2),
            "overburden_thickness": round(overburden, 2),
            "geological_strata_density": round(strata_density, 3),
            "core_recovery_rate": round(core_recovery, 1),
            "sandstone_shale_ratio": round(sandstone_shale, 2),
            "drilling_rate_index": round(drilling_rate, 2),
            "cutting_resistance_index": round(cutting_resistance, 2),
            "spectral_gamma_ray": round(gamma_ray, 1),
            "spectral_resistivity": round(resistivity, 1),
            "optical_reflectance": round(optical_reflectance, 3),
            "density_bulk": round(bulk_density, 3),
            "seam_num": seam_idx,
            "subsidiary_num": mine["sub_num"],
            "gcv": gcv,
            "ash": ash,
            "moisture": moisture,
            "volatile_matter": vm,
            "fixed_carbon": fixed_carbon,
            "created_at": sample_date.strftime("%Y-%m-%d %H:%M:%S")
        })

    df = pd.DataFrame(records)
    csv_path = os.path.join(output_dir, "coal_samples_synthetic.csv")
    df.to_csv(csv_path, index=False)
    print(f"Synthetic dataset generated successfully with {len(df)} records at: {csv_path}")
    print(f"GCV Range: {df['gcv'].min()} - {df['gcv'].max()} kcal/kg (Mean: {df['gcv'].mean():.1f})")
    print(f"Ash Range: {df['ash'].min()}% - {df['ash'].max()}% (Mean: {df['ash'].mean():.1f}%)")
    return csv_path

if __name__ == "__main__":
    generate_synthetic_dataset()
