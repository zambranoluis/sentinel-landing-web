// Approved copy from references/web-content.md.
export const capabilities = [
  {
    title: "Supermarkets and retail",
    body: "Identify configured events related to product concealment, cash-to-pocket activity, cashier monitoring and people flow, then present them for review with visual context.",
    id: "retail",
    icon: "cart",
  },
  {
    title: "Shops and pharmacies",
    body: "Extend operational visibility across smaller camera networks through configured detections and alerts directed to the people responsible for review.",
    id: "shops",
    icon: "pill",
  },
  {
    title: "Restaurants and bars",
    body: "Support review of cashier activity, people flow and fall events with visual and time-based records that make evaluation easier.",
    id: "restaurants",
    icon: "utensils",
  },
  {
    title: "Manufacturing and warehousing",
    body: "Monitor restricted areas, defined events in work zones and potential fall events, helping direct attention to situations that require review.",
    id: "manufacturing",
    icon: "factory",
  },
  {
    title: "Gas stations and forecourts",
    body: "Monitor high-priority events, including potential weapon-related events, cashier areas and licence-plate activity where recognition is configured, with alerts and context for review.",
    id: "gas-stations",
    icon: "fuel",
  },
] as const;

export const deployment = [
  {
    title: "Request a site assessment",
    body: "We review cameras, recorder, network, zones and operational requirements to determine compatibility, recommended scope and implementation needs.",
  },
  {
    title: "We install and configure",
    body: "We deploy the required Sentinel infrastructure, configure zones and capabilities, and tune the models to real site conditions.",
  },
  {
    title: "Your team starts reviewing events",
    body: "Configured detections appear in the dashboard with the available context for review. Alerts can be directed to the recipients and channels defined for the operation.",
  },
] as const;

export const benefits = [
  {
    title: "Identify relevant events as they happen",
    body: "Sentinel continuously monitors configured feeds and flags defined events for review, helping teams focus attention while a response may still be possible.",
  },
  {
    title: "Context ready for review",
    body: "Flagged events can include timestamped clips, screenshots and contextual information to support review, documentation and reporting.",
  },
  {
    title: "Greater control over operational data",
    body: "Sentinel can be deployed within the client's local infrastructure, supporting greater control over video and operational data. Data handling is confirmed for each implementation.",
  },
  {
    title: "Build on compatible camera infrastructure",
    body: "Sentinel can work with compatible existing IP camera systems or as part of a purpose-built installation. A site assessment confirms the requirements.",
  },
] as const;

export const faqs = [
  {
    title: "Do I need to buy new cameras?",
    body: "Not necessarily. Sentinel can work with compatible existing camera systems. The site assessment confirms compatibility and identifies any changes required before deployment.",
  },
  {
    title: "Does my footage go to the cloud?",
    body: "Sentinel supports deployments in which processing and operational data remain within the client's local infrastructure. The exact data flow, storage and alert configuration are confirmed for each implementation.",
  },
  {
    title: "How fast are the alerts?",
    body: "Alert timing depends on the detection model, configuration, network and deployment conditions. Sentinel is designed to flag configured events as they are detected and provide the available context for review.",
  },
  {
    title: "What can Sentinel detect?",
    body: "Sentinel can support capabilities such as facial recognition, cash-to-pocket, cashier monitoring, people flow, restricted-area monitoring, shoplifting/pilferage detection, licence plate recognition, custom object detection, weapon detection and other models configured for the implementation. The current catalogue and availability are confirmed during assessment.",
  },
  {
    title: "I already have security personnel. Why do I need Sentinel?",
    body: "Sentinel is designed to support trained personnel, not replace them. It can continuously monitor configured feeds and direct attention to events that require review, while your team remains responsible for judgement and response.",
  },
  {
    title: "What happens if my internet connection goes down?",
    body: "Where Sentinel is configured for local processing, core detection can continue without relying on cloud processing. Delivery to external alert channels may depend on connectivity. The exact behaviour is confirmed for each deployment.",
  },
  {
    title: "What happens if the equipment fails?",
    body: "System-health monitoring, recovery behaviour and support conditions depend on the deployed hardware and configuration. Support and replacement arrangements are defined in the implementation proposal.",
  },
  {
    title: "Am I locked into a fixed contract?",
    body: "Commercial terms are defined in the written proposal after the site assessment. You can review the scope, pricing and terms before deployment.",
  },
] as const;
