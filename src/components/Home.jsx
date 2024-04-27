import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import backgroundImg from "/assets/Walking-Outside.svg";
import entriesImg from "/assets/entries.svg";
import trendsImg from "/assets/trends.svg";

const Home = () => {
  return (
    <>
      <div className="container mx-auto my-8 px-8">
        <div className="landing-banner">
          <h1 className="landing-title">Journals</h1>
          <div id="new-entry" className="home-page-new-entry">
            <Link to="/entry/new">
              <FontAwesomeIcon icon={faPencil} className="mr-2" /> New Entry
            </Link>
          </div>
        </div>
        <div className="home-grid">
          <Link className="home-grid-col" to="/entries">
            <img src={entriesImg} alt="" className="home-grid-col-img" />
            <h3>View all entries</h3>
          </Link>
          <Link className="home-grid-col" to="/analysis">
            <img src={trendsImg} alt="" className="home-grid-col-img" />
            <h3>View mood trends</h3>
          </Link>
        </div>
      </div>

      <div className="background-image-wrapper">
        <img src={backgroundImg} alt="" />
      </div>
    </>
  );
};

export default Home;
