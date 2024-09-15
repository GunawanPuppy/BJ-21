const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const padWithZero = (number) => {
    return number < 10 ? '0' + number : number;
};

const convertFirebaseTimestampToDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
};

export const formatDate = (timestamp) => {
    const d = convertFirebaseTimestampToDate(timestamp);
    const day = padWithZero(d.getDate());
    const month = d.getMonth();
    const year = d.getFullYear();

    return `${day} ${months[month]} ${year}`;
};