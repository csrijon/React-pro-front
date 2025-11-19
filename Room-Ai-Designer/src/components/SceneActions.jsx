import React from "react";
import "../css/SceneActions.css";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

const SceneActions = () => {

    const onEdit =()=>{
        alert("Edit button clicked");
    }
    const onReviz =()=>{
        alert("Revisualize button clicked");
    }
    const onShare =()=>{
        alert("Share button clicked");
    }
    const onDownload =()=>{
        alert("Download button clicked");
    }
  return (
    <div className="scene-actions">
      <button className="action-btn" onClick={onEdit}>
        <EditOutlinedIcon className="action-icon" />
        Edit
      </button>

      <button className="action-btn" onClick={onReviz}>
        <AutorenewOutlinedIcon className="action-icon" />
        Revisualize
      </button>

      <button className="action-btn" onClick={onShare}>
        <ShareOutlinedIcon className="action-icon" />
        Share
      </button>

      <button className="action-btn" onClick={onDownload}>
        <DownloadOutlinedIcon className="action-icon" />
      </button>
    </div>
  );
};

export default SceneActions;
