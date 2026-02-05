# Asthma Risk Calculation Flow

```mermaid
flowchart TD
    A[Start: User Opens Daily Log] --> B[Fetch Live Climate Data]
    B --> C[Weather API: Temp & Humidity]
    B --> D[Air Pollution API: AQI]
    C --> E[Calculate Symptom Severity Score]
    D --> E
    E --> F[Determine Symptom Status]
    F --> G{High Symptoms?}
    G -->|Yes| H[Final Status: HIGH Risk<br/>Color: Red<br/>Advice: Immediate Care]
    G -->|No| I{AQI > 150?}
    I -->|Yes| J[Final Status: HIGH Risk<br/>Color: Red<br/>Advice: Avoid Outdoor Exposure]
    I -->|No| K{Moderate Symptoms<br/>OR AQI > 80?}
    K -->|Yes| L[Final Status: MODERATE Risk<br/>Color: Yellow<br/>Advice: Monitor & Limit Activity]
    K -->|No| M[Final Status: LOW Risk<br/>Color: Green<br/>Advice: Safe Conditions]
    H --> N[Display Status in Form]
    J --> N
    L --> N
    M --> N
    N --> O[User Submits Log]
    O --> P[Save Log with Status]
    P --> Q[End]

    classDef high fill:#ffcccc,stroke:#ff0000,stroke-width:2px
    classDef moderate fill:#ffffcc,stroke:#ffcc00,stroke-width:2px
    classDef low fill:#ccffcc,stroke:#00ff00,stroke-width:2px

    class H,J high
    class L moderate
    class M low
