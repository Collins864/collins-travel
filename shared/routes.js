function createSeats(occupiedLabels) {
  return ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4"].map(
    (label) => ({
      label,
      occupied: occupiedLabels.includes(label)
    })
  );
}

export const routeCatalog = [
  {
    id: "tr-nyc-bos-express",
    type: "train",
    operator: "Northeast Arrow",
    from: "New York",
    to: "Boston",
    departure: "07:20",
    arrival: "11:05",
    duration: "3h 45m",
    price: 86,
    className: "Business",
    seats: createSeats(["A2", "B3", "C4", "D1"])
  },
  {
    id: "bus-nyc-bos-night",
    type: "bus",
    operator: "RoadLine",
    from: "New York",
    to: "Boston",
    departure: "08:10",
    arrival: "12:55",
    duration: "4h 45m",
    price: 49,
    className: "Premium Coach",
    seats: createSeats(["A1", "A4", "C2", "D4"])
  },
  {
    id: "tr-nyc-bos-late",
    type: "train",
    operator: "MetroVista Rail",
    from: "New York",
    to: "Boston",
    departure: "13:35",
    arrival: "17:30",
    duration: "3h 55m",
    price: 72,
    className: "Standard Plus",
    seats: createSeats(["B1", "B2", "C3", "D2"])
  },
  {
    id: "bus-nyc-bos-saver",
    type: "bus",
    operator: "CityHop",
    from: "New York",
    to: "Boston",
    departure: "16:20",
    arrival: "21:25",
    duration: "5h 05m",
    price: 39,
    className: "Saver",
    seats: createSeats(["A3", "B4", "C1", "D3"])
  },
  {
    id: "tr-bos-was-direct",
    type: "train",
    operator: "Atlantic Rail",
    from: "Boston",
    to: "Washington",
    departure: "09:00",
    arrival: "15:40",
    duration: "6h 40m",
    price: 118,
    className: "Business",
    seats: createSeats(["A1", "C2", "D4"])
  },
  {
    id: "bus-phi-nyc-rapid",
    type: "bus",
    operator: "RapidGo",
    from: "Philadelphia",
    to: "New York",
    departure: "10:15",
    arrival: "12:25",
    duration: "2h 10m",
    price: 27,
    className: "Express",
    seats: createSeats(["A2", "C3"])
  }
];
