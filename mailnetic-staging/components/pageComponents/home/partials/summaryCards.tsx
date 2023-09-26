import React from "react"

export default function SummaryCards (){
    return (
        <div className="summary-container">
        <div className="summary-item mr-5">
          <div className="summary-icon-container">
            <img className="summary-icon" src="/svg/sent.svg" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="summary-item-label">Total Sent</p>
            <div className="flex flex-row items-center justify-center ">
              <p className="summary-item-value">41.56%</p>
              <div className="summary-change-container-positive ">
                <p className="summary-change-text-positive">+5.7%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="summary-item mx-5">
          <div className="summary-icon-container">
            <img className="summary-icon" src="/svg/eye-off.svg" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="summary-item-label">Avg. Open Rate</p>
            <div className="flex flex-row items-center justify-center ">
              <p className="summary-item-value">-20.56%</p>
              <div className="summary-change-container-negative">
                <p className="summary-change-text-negative">-5.7%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="summary-item ml-5">
          <div className="summary-icon-container">
            <img className="summary-icon" src="/svg/cursor-click.svg" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="summary-item-label">Avg. Click Rate</p>
            <div className="flex flex-row items-center justify-center ">
              <p className="summary-item-value">41.56%</p>
              <div className="summary-change-container-positive ">
                <p className="summary-change-text-positive">+5.7%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

