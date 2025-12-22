export const calculateDistance = (location) => {
  // Mock distance calculation based on location
  const distances = {
    Adum: 5,
    Gyinase: 10,
    Oforikrom: 8,
    Amakom: 6,
    KNUST: 12,
    Santasi: 15,
    "Tech Junction": 11,
    Ayigya: 13,
    Bomso: 9,
    Kotei: 14,
    Emina: 16,
    Atonsu: 18,
    Asafo: 7,
    Danyame: 4,
    Nhyiaeso: 3,
    Kejetia: 2,
    Tafo: 9,
    Krofrom: 5,
    Suame: 8,
    Bantama: 4,
  };
  return distances[location] || 10; // Default distance
};
