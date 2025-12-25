export const getMovieCertification = (title: string): string => {
    const certifications: Record<string, string> = {
        "Thamma": "UA16+",
        "Kantara Chapter-1": "UA 16+",
        "SatyaPrem Ki Katha": "PG",
        "Kaantha": "UA 12+",
        "3 Idiots": "UA",
        "RajaKumara": "UA",
        "Kis Kisko Pyaar Karoon": "A",
        "Predator:Badlands": "A",
        "Love OTP": "UA 16+",
        "The Running Man": "A",
        "The Summit": "UA"
    };

    return certifications[title] || "UA"; // Default to UA if unknown
};
