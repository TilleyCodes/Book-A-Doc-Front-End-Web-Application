export function FormatDate(dateString) {
    const date = new Date(dateString)

    const day = date.getDate();
    const suffix = (day === 1 || day === 21 || day === 31) ? "st" :
                   (day === 2 || day === 22) ? "nd" :
                   (day === 3 || day === 23) ? "rd" : "th";

    // eslint-disable-next-line no-undef
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
    }).format(date);

    return `${day}${suffix} ${formattedDate}`
};