const noteData = [
    // N°5 EDP (id: 1)
    {
        id: 1,
        note_type: "top",
        time_stamp: "2024-03-19",
        product_id: null,
        spice_id: 1,
        note_spice_id: 1,
        perfume_id: 1
    },
    {
        id: 2,
        note_type: "middle",
        time_stamp: "2024-03-19",
        product_id: null,
        spice_id: 2,
        note_spice_id: 2,
        perfume_id: 1
    },
    {
        id: 3,
        note_type: "base",
        time_stamp: "2024-03-19",
        product_id: null,
        spice_id: 3,
        note_spice_id: 3,
        perfume_id: 1
    },
    // J'adore (id: 2)
    {
        id: 4,
        note_type: "top",
        time_stamp: "2024-03-19",
        product_id: null,
        spice_id: 4,
        note_spice_id: 4,
        perfume_id: 2
    },
    {
        id: 5,
        note_type: "middle",
        time_stamp: "2024-03-19",
        product_id: null,
        spice_id: 5,
        note_spice_id: 5,
        perfume_id: 2
    },
    {
        id: 6,
        note_type: "base",
        time_stamp: "2024-03-19",
        product_id: null,
        spice_id: 6,
        note_spice_id: 6,
        perfume_id: 2
    },
    // Light Blue (id: 3)
    {
        id: 7,
        note_type: "top",
        time_stamp: "2024-03-19",
        product_id: null,
        spice_id: 7,
        note_spice_id: 7,
        perfume_id: 3
    },
    {
        id: 8,
        note_type: "middle",
        time_stamp: "2024-03-19",
        product_id: null,
        spice_id: 8,
        note_spice_id: 8,
        perfume_id: 3
    },
    {
        id: 9,
        note_type: "base",
        time_stamp: "2024-03-19",
        product_id: null,
        spice_id: 9,
        note_spice_id: 9,
        perfume_id: 3
    }
];

// 향료 데이터
const spiceData = {
    // N°5 EDP 향료
    1: { name: "Bergamot", korean_name: "베르가못" },
    2: { name: "Rose", korean_name: "로즈" },
    3: { name: "Vanilla", korean_name: "바닐라" },

    // J'adore 향료
    4: { name: "Bergamot", korean_name: "베르가못" },
    5: { name: "Rose", korean_name: "로즈" },
    6: { name: "Jasmine", korean_name: "자스민" },

    // Light Blue 향료
    7: { name: "Sicilian Lemon", korean_name: "시칠리안 레몬" },
    8: { name: "Green Apple", korean_name: "그린 애플" },
    9: { name: "Cedar", korean_name: "시더" }
};

export { noteData, spiceData };