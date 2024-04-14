import Journals from "./Journals";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const Entries = () => {
  return (
    <div className="container mx-auto my-8 px-8">
      <div id="new-entry">
        <Link to="/entry/new">
          <FontAwesomeIcon icon={faPencil} className="mr-2" /> New Entry
        </Link>
      </div>
      <Journals />
    </div>
  );
};

export default Entries;
