import {Platform} from "react-native";
// Time zone manipulation for android
import moment from "moment";

/* Takes the date and formats it to a readable state */
export default function formatDate(date) {
    if (Platform.OS === "ios") {
        var dateFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric"};
        return new Date(date).toLocaleDateString("en-CA", dateFormatOptions);
    } else {
        return moment(date).format("LLL");
    }
}
