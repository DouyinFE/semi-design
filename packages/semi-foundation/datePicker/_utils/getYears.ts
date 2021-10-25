const getYears = () => {
    const year = new Date().getFullYear();
    const startYear = year - 100;
    return Array.from({ length: 200 }, (v, i) => startYear + i);
};
export default getYears;