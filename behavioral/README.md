# Behavioral Experiments

This directory contains the behavioral experiments developed as part of the **Spatial Category Learning** project. The tasks were implemented in **jsPsych** and deployed using **JATOS**.

The experiments were developed iteratively throughout the project. This repository contains the primary experimental versions used in the associated publications and thesis work, preserved in their original form for transparency and reproducibility.

---

## Directory Structure

```text
experiments/
├── v4/
├── v6/
├── v10/
└── v11/
```

Each experiment directory is a self-contained JATOS study containing:

* HTML entry file
* JavaScript task logic
* Stimulus files
* jsPsych library
* Supporting assets

The experiments are intentionally kept separate to preserve the original implementation of each study.

---

## Included Experiments

| Version | Description                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------- |
| **v4**  | Introduction of keypress responses and spatial congruency manipulation.                                             |
| **v6**  | Within-subject design incorporating multiple spatial learning phases.                                               |
| **v10** | Balanced multi-phase design with congruent and incongruent response mappings.                                       |
| **v11** | Final scanner-compatible behavioral implementation with fully separated spatial learning and categorization phases. |

---

## Recommended Version

For new users, **v11** is the recommended reference implementation. Earlier versions are retained to document the evolution of the experimental paradigm.

---

## Running an Experiment

Each experiment can be run independently using JATOS.

1. Install JATOS.
2. Create a new study.
3. Import the contents of the desired experiment directory (e.g., `experiments/v11/`).
4. Launch the study through the JATOS interface.

No additional build or compilation steps are required.

---

## Notes

* Earlier pilot versions are intentionally omitted.
* Original directory structures have been preserved to maximize reproducibility.
* These experiments are provided as archived implementations rather than actively maintained software.

---

## License

This project is licensed under the MIT License. See the repository `LICENSE` file for details.




