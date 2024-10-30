import { Link } from "react-router-dom";

export default function UnderDevelopment() {

    const currentUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if(!currentUserInfo) return;

  return (
    <>
      <div
        className="main-container"
        style={{
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          color: "black !important",
        }}
      >
        <div className="text-center">
          <div className="col-sm-12col-md-6 offset-md-3 col-lg-6 offset-lg-3">
            <br />
            <h2>
              <b>Coming Soon</b>
            </h2>

            <p>
              Our website is currently undergoing a transformation to bring you
              a fresh and improved online experience. We can't wait to unveil
              the new look and features. Stay tuned for the big reveal, and
              thank you for your patience as we work diligently to make your
              future visits even better!
            </p>
          </div>
          <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-12">
            <img
              alt="Under Development"
              src="https://i.pinimg.com/originals/8a/f4/fe/8af4febc154ad406079ce04b7e9f70ee.gif"
              // src="../../assets/images/underWebDevelopmentGif.gif"
              style={{ width: "70%" }}
            />
          </div>
          <br />
          <br />
          <div className="text-center">
            <Link to={currentUserInfo.obj?.role === 'Patient' ? '/patient' : '/doctor'}>← Go To Home</Link>
          </div>
        </div>
      </div>
    </>
  );
}
