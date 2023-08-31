import React, { useState } from "react";
import '../../scss/FormFooter.scss'
const ContactForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isChecked && email !== "") {
      // Aquí puedes realizar la acción de enviar el correo o realizar la notificación
      console.log(`Email: ${email}`);
      console.log("Notificar por correo!");
    }
  };

  return (
    <div className="contact-form">
      <h2 className="form-title">Permanezcamos en contacto</h2>
      <form onSubmit={handleSubmit}>
        <p>
          Te informaremos sobre nuevos productos, promociones, descuentos,
          eventos y noticias relacionadas a tus intereses
        </p>
        <input
          className="form-input"
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            required
          />
          He leído los términos y condiciones y políticas de privacidad
        </label>
        <button className="form-button" type="submit">
          Notifíquenme por Correo!
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
