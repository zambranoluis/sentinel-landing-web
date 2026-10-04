export type HeroDetection = {
  id: string;
  title: string;
  description: string;
  fields: readonly [readonly [string, string], readonly [string, string]];
  outline: string;
  region: string;
  anchor: readonly [number, number];
  nodes?: readonly (readonly [number, number])[];
  route?: boolean;
};

export const sceneSize = { width: 1672, height: 941 };
export const transferPath =
  "M590 454C820 766 1042 638 1179 752S1439 774 1497 919";
export const transferWave = [
  transferPath,
  "M590 454C820 767 1042 639 1179 752S1439 775 1497 919",
  transferPath,
  "M590 454C820 765 1042 637 1179 752S1439 773 1497 919",
  transferPath,
].join(";");

// Paint vehicles/areas first, then people: nested people own the top hit region.
export const heroDetections: readonly HeroDetection[] = [
  {
    id: "truck",
    title: "Loading truck",
    description: "Truck positioned beside the warehouse loading bays.",
    fields: [
      ["Subject", "Delivery vehicle"],
      ["Area", "Loading bays"],
    ],
    outline:
      "M635 307 937 328 937 478 632 466Z M635 307 681 305 953 321 937 328 M937 478 953 469 953 321",
    region: "M635 307 681 305 953 321 953 469 937 478 632 466Z",
    anchor: [953, 365],
    nodes: [
      [635, 307],
      [937, 328],
      [937, 478],
      [632, 466],
    ],
  },
  {
    id: "forklift",
    title: "Forklift",
    description: "Forklift transporting a pallet through the unloading area.",
    fields: [
      ["Subject", "Material handling vehicle"],
      ["Activity", "Pallet transport"],
    ],
    outline:
      "M1218 495 1376 508 1433 544 1274 531Z M1218 495v211l56 35 159-24V544 M1274 531v210",
    region: "M1218 495 1376 508 1433 544 1433 717 1274 741 1218 706Z",
    anchor: [1218, 550],
    nodes: [
      [1218, 495],
      [1274, 531],
      [1274, 741],
      [1433, 717],
    ],
  },
  {
    id: "pallet-bay",
    title: "Loading-bay pallet",
    description: "Stacked cargo beside the person unloading near the truck.",
    fields: [
      ["Subject", "Palletised cargo"],
      ["Area", "Truck-side bay"],
    ],
    outline: "M984 448l64 13v87l-64-15Z",
    region: "M984 448l64 13v87l-64-15Z",
    anchor: [1048, 490],
    nodes: [
      [984, 448],
      [1048, 548],
    ],
  },
  {
    id: "pallet-forklift",
    title: "Transport pallet",
    description: "Pallet of boxed cargo at the front of the forklift.",
    fields: [
      ["Subject", "Boxed cargo"],
      ["Area", "Forklift approach"],
    ],
    outline: "M1146 550l83 11v146l-83-24Z",
    region: "M1146 550l83 11v146l-83-24Z",
    anchor: [1146, 600],
    nodes: [
      [1146, 550],
      [1229, 707],
    ],
  },
  {
    id: "pallet-wall",
    title: "Warehouse-side pallet",
    description: "Stacked boxes beside the outer warehouse wall.",
    fields: [
      ["Subject", "Stacked boxes"],
      ["Area", "Warehouse edge"],
    ],
    outline: "M1546 616l78 14v-48l-78-17Z",
    region: "M1546 616l78 14v-48l-78-17Z",
    anchor: [1546, 585],
  },
  {
    id: "pallet-front",
    title: "Foreground pallet",
    description: "Boxed cargo in the foreground staging area.",
    fields: [
      ["Subject", "Palletised boxes"],
      ["Area", "Near staging area"],
    ],
    outline: "M1212 807l150 14 40 100 M1212 807v134",
    region: "M1212 807 1362 821 1402 921 1402 941 1212 941Z",
    anchor: [1212, 815],
    nodes: [
      [1212, 807],
      [1362, 821],
    ],
  },
  {
    id: "pallet-right",
    title: "Outer staging pallets",
    description: "Grouped cargo extending along the right-hand staging area.",
    fields: [
      ["Subject", "Grouped pallets"],
      ["Area", "Outer staging area"],
    ],
    outline: "M1511 683l111 25 50 30 M1511 683v258",
    region: "M1511 683 1622 708 1672 738 1672 941 1511 941Z",
    anchor: [1511, 710],
  },
  {
    id: "transfer-route",
    title: "Transfer route",
    description: "Transfer route from truck to unloading area.",
    fields: [
      ["Connection", "Truck to staging area"],
      ["Path", "Illustrative cargo movement"],
    ],
    outline: transferPath,
    region: transferPath,
    anchor: [1179, 752],
    route: true,
  },
  {
    id: "person-truck",
    title: "Person at the truck",
    description: "Person handling cargo at the truck.",
    fields: [
      ["Subject", "Person"],
      ["Activity", "Cargo handling"],
    ],
    outline:
      "M821 355h10m-10 0v12m34-12h-10m10 0v12m-34 69h10m-10 0v-12m34 12h-10m10 0v-12",
    region: "M821 355h34v81h-34Z",
    anchor: [855, 395],
  },
  {
    id: "person-bay",
    title: "Person at the loading bay",
    description: "Person moving cargo beside the loading-bay pallet.",
    fields: [
      ["Subject", "Person"],
      ["Area", "Unloading area"],
    ],
    outline:
      "M1062 466h-12v14m47-14h12v14m-59 67h12m-12 0v-14m59 14h-12m12 0v-14",
    region: "M1050 466h59v81h-59Z",
    anchor: [1109, 505],
  },
  {
    id: "person-door",
    title: "Person at the warehouse door",
    description: "Person handling cargo at the open warehouse door.",
    fields: [
      ["Subject", "Person"],
      ["Area", "Warehouse entrance"],
    ],
    outline:
      "M1429 442h-12v14m49-14h12v14m-61 72h12m-12 0v-14m61 14h-12m12 0v-14",
    region: "M1417 442h61v86h-61Z",
    anchor: [1417, 470],
  },
  {
    id: "person-driver",
    title: "Forklift operator",
    description: "Person operating the forklift in the unloading area.",
    fields: [
      ["Subject", "Person"],
      ["Activity", "Forklift operation"],
    ],
    outline:
      "M1318 559h10m-10 0v12m39-12h-10m10 0v12m-39 61h10m-10 0v-12m39 12h-10m10 0v-12",
    region: "M1318 559h39v73h-39Z",
    anchor: [1357, 590],
  },
];
