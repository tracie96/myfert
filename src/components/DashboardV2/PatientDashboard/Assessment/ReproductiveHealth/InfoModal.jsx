import { InfoCircleOutlined , CloseOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
const InfoModal = ({showInfoMoal, handleInfoModal}) => {
  if (!showInfoMoal) return null;
    return ( 
        <div className="info-box">
          <div className="inf-header-wrapper" style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
            <div className="info-header">
                <InfoCircleOutlined className="info-icon" />
                <Title
                  level={5}
                  className="info-title"
                  style={{ color: "#335CAD" }}
                >
                  What is Premenstrual Syndrome (PMS)?
                </Title>
              </div>
              <CloseOutlined
              className="close-icon"
              style={{ fontSize: "16px", cursor: "pointer", color: "#333" }}
              onClick={handleInfoModal}
            />
          </div>
            <Paragraph>
              PMS refers to physical and emotional symptoms experienced 1-2
              weeks before a menstrual period. Common symptoms include:
            </Paragraph>
            <ul className="info-list">
              <li>
                <strong>Mood Changes:</strong> Mood swings, irritability,
                anxiety, or depression.
              </li>
              <li>
                <strong>Physical Discomfort:</strong> Bloating, breast
                tenderness, headaches, joint or muscle pain.
              </li>
              <li>
                <strong>Other Symptoms:</strong> Fatigue, trouble sleeping,
                changes in appetite, acne, constipation, or diarrhea.
              </li>
            </ul>
          </div>
     );
}
 
export default InfoModal;