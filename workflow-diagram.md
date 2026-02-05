# Asthma Dashboard Data Flow Diagram

```mermaid
graph TD
    A[OpenWeatherMap API] --> B[fetchWeather Function]
    B --> C[Get Weather Data<br/>Temperature & Humidity]
    B --> D[Get AQI Data<br/>Air Pollution Index]
    D --> E[Scale AQI<br/>1-5 → 25-125]
    C --> F[Set Climate State<br/>{temp, humidity, aqi}]
    E --> F
    F --> G[Create New Reading<br/>{time, aqi}]
    G --> H[Update AQI Trend<br/>Last 5 readings]
    H --> I[Render Dashboard]

    J[User Input Form] --> K[calculateSymptomSeverity<br/>Score symptoms]
    K --> L[getSymptomStatus<br/>HIGH/MODERATE/LOW]
    L --> M[getFinalHealthStatus<br/>Combine symptoms + climate]
    M --> N[Set Status<br/>Color & Advice]
    N --> I

    I --> O[Live Climate Panel<br/>Color-coded blocks with icons]
    I --> P[AQI Trend Chart<br/>Gradient line + colored dots]
    I --> Q[Daily Log Form<br/>Symptoms & activity]
    I --> R[Risk Status Display<br/>Color-coded advice]
    I --> S[Historical Logs<br/>Color-coded severity]

    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#e8f5e8
    style E fill:#fff3e0
    style F fill:#fff3e0
    style G fill:#fff3e0
    style H fill:#fff3e0
    style I fill:#c8e6c9
    style J fill:#fce4ec
    style K fill:#fce4ec
    style L fill:#fce4ec
    style M fill:#fce4ec
    style N fill:#fce4ec
    style O fill:#e3f2fd
    style P fill:#e3f2fd
    style Q fill:#e3f2fd
    style R fill:#e3f2fd
    style S fill:#e3f2fd
```

## Diagram Explanation

### Data Flow Overview:
1. **API Fetching**: Every 60 seconds, the dashboard fetches live weather and AQI data from OpenWeatherMap
2. **Data Processing**: AQI is scaled from 1-5 to 25-125 for better visualization
3. **State Updates**: Climate data and AQI trend (last 5 readings) are updated
4. **Risk Calculation**: User symptoms are scored and combined with environmental data to determine health status
5. **Dashboard Rendering**: All components update with color-coded risk indicators

### Key Components:
- **🔵 Blue**: API and data fetching
- **🟢 Green**: Data processing and state management
- **🟣 Purple**: User input and symptom calculation
- **🟠 Orange**: Dashboard rendering and UI updates

### Risk Levels:
- **🔴 Red (High Risk)**: Immediate action needed
- **🟡 Yellow (Moderate Risk)**: Monitor closely
- **🟢 Green (Low Risk)**: Safe conditions

This diagram helps visualize how real-time environmental data integrates with user health inputs to provide personalized asthma management insights.
