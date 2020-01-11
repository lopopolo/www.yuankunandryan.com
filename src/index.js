import $ from "jquery";
import "./index.scss";

const acceptInvitation = () => {
  const formData = $("#rsvp-form-accept").serializeArray();
  const serialized = {};
  for (let i = 0; i < formData.length; i += 1) {
    serialized[formData[i].name] = formData[i].value;
  }
  $.post(
    $("#rsvp-form-accept").attr("action"),
    JSON.stringify(serialized),
    () => {
      $("#rsvp-thanks").show();
    },
    "json"
  );
};

window.acceptInvitation = acceptInvitation;
window.$ = $;
