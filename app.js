const urlInput = document.getElementById("api-url");
const methodSelect = document.getElementById("http-method");
const sendButton = document.getElementById("send-btn");

const headerKeyInput = document.getElementById("api-header-key");
const headerValInput = document.getElementById("api-header-val");
const requestBodyContainer = document.getElementById("request-body-container");
const requestBodyInput = document.getElementById("request-body");

const statusBadge = document.getElementById("status-badge");
const timeBadge = document.getElementById("time-badge");
const treeContainer = document.getElementById("tree-container");

methodSelect.addEventListener("change", () => {
  const method = methodSelect.value;
  requestBodyContainer.style.display = (method === "POST" || method === "PUT" || method === "PATCH") ? "block" : "none";
});

// Preset Buttons Event Delegation
document.querySelectorAll(".preset-btn").forEach(button => {
  button.addEventListener("click", () => {
    urlInput.value = button.getAttribute("data-url");
    methodSelect.value = button.getAttribute("data-method");
    methodSelect.dispatchEvent(new Event('change'));
    sendButton.click();
  });
});

// Core Network Async Engine (Tracks Actual Response Time)
async function executeApiCall(url, method, rawBodyString, customHeaderKey, customHeaderVal) {
  // 1. Capture the precise high-resolution timestamp right before the call
  const startTime = performance.now();
  
  try {
    const fetchOptions = {
      method: method,
      headers: {}
    };

    if (customHeaderKey.trim() && customHeaderVal.trim()) {
      fetchOptions.headers[customHeaderKey.trim()] = customHeaderVal.trim();
    }

    if (method === "POST" || method === "PUT" || method === "PATCH") {
      fetchOptions.headers["Content-Type"] = "application/json";
      if (rawBodyString.trim()) {
        try {
          JSON.parse(rawBodyString);
          fetchOptions.body = rawBodyString;
        } catch (e) {
          throw new Error("Client Error: Invalid JSON syntax inside Request Body.");
        }
      }
    }

    // 2. Await the live network stream resolution
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    
    // 3. Capture the timestamp right after data arrives
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(0); // Actual round-trip time

    return { success: response.ok, status: response.status, time: `${duration}ms`, payload: data };

  } catch (error) {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(0);
    return {
      success: false,
      status: error.message.includes("Invalid JSON") ? "Bad JSON Format" : "Error / Fail",
      time: `${duration}ms`,
      payload: error.message
    };
  }
}

sendButton.addEventListener("click", async () => {
  const targetUrl = urlInput.value.trim();
  const targetMethod = methodSelect.value;
  const jsonBodyPayload = requestBodyInput.value;
  const hKey = headerKeyInput.value;
  const hVal = headerValInput.value;

  if (!targetUrl) {
    alert("Please provide a valid URL endpoint first!");
    return;
  }

  statusBadge.textContent = "FETCHING...";
  statusBadge.className = "badge badge-loading";
  timeBadge.textContent = "Calculating...";
  treeContainer.innerHTML = `<p class="placeholder-text">Waiting for network stream resolution...</p>`;

  const result = await executeApiCall(targetUrl, targetMethod, jsonBodyPayload, hKey, hVal);

  timeBadge.textContent = result.time;
  statusBadge.textContent = result.status;

  if (result.success) {
    statusBadge.className = "badge badge-success";
    renderVisualTree(result.payload, treeContainer);
  } else {
    statusBadge.className = "badge badge-error";
    treeContainer.innerHTML = `<p style="color: #ef4444; font-family: monospace;">⚠️ Error: ${result.payload}</p>`;
  }
});

function renderVisualTree(data, container) {
  container.innerHTML = "";

  function buildTree(nodeData, parentElement) {
    if (Array.isArray(nodeData)) {
      nodeData.forEach((item, index) => {
        const itemWrapper = document.createElement("div");
        itemWrapper.className = "tree-node array-item";
        itemWrapper.innerHTML = `<strong>[Index ${index}]</strong>: Object`;
        
        const childContainer = document.createElement("div");
        childContainer.style.paddingLeft = "15px";
        childContainer.style.display = "none";
        
        buildTree(item, childContainer);
        
        itemWrapper.addEventListener("click", (event) => {
          event.stopPropagation();
          const isHidden = childContainer.style.display === "none";
          childContainer.style.display = isHidden ? "block" : "none";
        });

        parentElement.appendChild(itemWrapper);
        parentElement.appendChild(childContainer);
      });
    } else if (typeof nodeData === "object" && nodeData !== null) {
      Object.keys(nodeData).forEach(key => {
        const propertyRow = document.createElement("div");
        propertyRow.className = "tree-node object-property";
        const value = nodeData[key];

        if (typeof value === "object" && value !== null) {
          propertyRow.innerHTML = `<strong>${key}</strong>: { ... } <span style="color: #64748b; font-size: 0.8rem;">(Click to expand)</span>`;
          propertyRow.style.cursor = "pointer";

          const childContainer = document.createElement("div");
          childContainer.style.paddingLeft = "15px";
          childContainer.style.display = "none";
          
          buildTree(value, childContainer);

          propertyRow.addEventListener("click", (event) => {
            event.stopPropagation();
            const isHidden = childContainer.style.display === "none";
            childContainer.style.display = isHidden ? "block" : "none";
          });

          parentElement.appendChild(propertyRow);
          parentElement.appendChild(childContainer);
        } else {
          propertyRow.innerHTML = `<strong>${key}</strong>: <span style="color: #4ade80;">${value}</span>`;
          parentElement.appendChild(propertyRow);
        }
      });
    } else {
      const itemRow = document.createElement("div");
      itemRow.className = "tree-node";
      itemRow.innerHTML = `Response Value: <span style="color: #4ade80;">${nodeData}</span>`;
      parentElement.appendChild(itemRow);
    }
  }

  buildTree(data, container);
}