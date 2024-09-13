import AllTime from "../components/AllTime";
import WeekReport from "../components/WeekReport";

const ResultsPage = () => {
    return (
        <div className="flex flex-col">
            <WeekReport />
            <AllTime/>
        </div>
    );
};

export default ResultsPage;