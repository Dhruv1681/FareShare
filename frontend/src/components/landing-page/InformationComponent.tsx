import { Link } from "react-router-dom";
import checkboxImage from "../../assets/images/checkbox.png";
import webImage from "../../assets/icons/web.png";
import { useTranslation } from "react-i18next";

const InformationComponent = () => {
  const { t } = useTranslation();

  const contentArray = [
    { text: t("Effortless") },
    { text: t("Real-Time") },
    { text: t("Smart") },
    { text: t("Simplified") },
    { text: t("Secure") },
  ];

  return (
    <>
      <div className="container mt-5">
        <main>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h2 className="display-4 mb-4">
                  {t("SimplifyShared")}
                </h2>
                <p className="lead text-muted display-5">
                  {t("ExperienceEase")}{" "}
                  <span style={{ color: "#32C29F", fontWeight: "bold" }}>
                    {t("FandT")}
                  </span>
                  .
                </p>
                <br />
                <Link to="/home/register">
                  <button
                    type="button"
                    className="btn btn-success btn-lg hoverable"
                    style={{
                      backgroundColor: "#32C29F",
                      transition: "background-color 0.3s",
                    }}
                  >
                    {t("GetStarted")}
                  </button>
                </Link>
                <p className="mt-3">
                  {t("FreeFor")}{" "}
                  <img
                    src={webImage}
                    alt="web"
                    style={{ width: "15px", height: "15px" }}
                  />{" "}
                  {t("web")}.
                </p>
                <p className="text-muted">{t("MadeWith")} :) {t("inBoston")}</p>
              </div>
              <div className="col-lg-6">
                <div
                  className="p-4 align-self-end"
                  style={{ margin: "0 70px" }}
                >
                  {contentArray.map((item, index) => (
                    <div key={index} className="d-flex mb-4">
                      <img
                        src={checkboxImage}
                        alt="checkbox"
                        style={{ width: "30px", height: "30px" }}
                      />
                      <p className="lead ml-3">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default InformationComponent;
