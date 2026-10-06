import { ScaleLoader } from "react-spinners";
import "./loading.css";

export default function Loading() {
    return (
        <div className="loading">
            <ScaleLoader color="#E2211C" />
        </div>
    )
}