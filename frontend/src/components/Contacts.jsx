import "./css/contacts.css";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./ModalForm";
import ReactDOM from "react-dom";
import { useState } from "react";
import { services } from "../data/services";
export const Contacts = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div ref={ref} className="contacts-container">
      <span className="contacts-title">{t("contacts-title")}</span>
      <img
        src="/vectors/15.png"
        className="vectors"
        alt="вектор3"
        style={{ position: "absolute", left: "17%", bottom: 300, zIndex: -999 }}
      />
      <div className="contacts">
        <div
          onClick={() => setIsModalOpen(true)}
          className="contacts-item order"
        >
          {t("order-project")}
          <img src="/greenarrow.png" alt="Стрелка вправо" />
        </div>
        <a
          href={t("brief-form-url")}
          target="_blank"
          rel="noreferrer"
          className="contacts-item filled"
        >
          {t("fill-brief")}
          <br></br>
          <span style={{ fontSize: 14 }}>{t("fill-brief-description")}</span>
          <img src="/arrow-top.png" alt="Стрелка вправо" />
        </a>
        <a
          href={`mailto:${t("mail-address")}`}
          rel="noreferrer"
          target="_blank"
          className="contacts-item filled"
        >
          {t("mail")}
          <br></br>
          <span style={{ fontSize: 14 }}>{t("mail-address")}</span>
          <img src="/arrow-top.png" alt="Стрелка вправо" />
        </a>
        <a
          href={`https://t.me/${t("telegram-handle").replace("@", "")}`}
          target="_blank"
          rel="noreferrer"
          className="contacts-item filled"
        >
          {t("telegram")}
          <br></br>
          <span style={{ fontSize: 14 }}>{t("telegram-handle")}</span>
          <img src="/arrow-top.png" alt="Стрелка вправо" />
        </a>
      </div>
      {isModalOpen &&
        ReactDOM.createPortal(
          <Modal
            onClose={() => setIsModalOpen(false)}
            selectedServiceId={services[0]["id"]}
          />,
          document.body
        )}
    </div>
  );
});
