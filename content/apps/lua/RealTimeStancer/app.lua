-- Real Time Stancer for Assetto Corsa
-- CSP Lua App for real-time stance adjustment

-- CSP Version Check
local cspVersion = ac.getPatchVersionCode()
if cspVersion < 2459 then -- CSP 0.1.80+
    ac.error("Real Time Stancer requires CSP 0.1.80 or higher")
    return
end

-- State variables
local stanceData = {
    frontLeft = {offset = 0, camber = 0, trackWidth = 0, rideHeight = 0},
    frontRight = {offset = 0, camber = 0, trackWidth = 0, rideHeight = 0},
    rearLeft = {offset = 0, camber = 0, trackWidth = 0, rideHeight = 0},
    rearRight = {offset = 0, camber = 0, trackWidth = 0, rideHeight = 0}
}

local selectedWheel = 0 -- 0=FL, 1=FR, 2=RL, 3=RR
local presetName = "default"
local showSaveDialog = false
local showLoadDialog = false
local availablePresets = {}
local configPath = ac.getFolder(ac.FolderID.ACApps) .. "/lua/RealTimeStancer/config_presets.json"

-- Wheel names
local wheelNames = {"Front Left", "Front Right", "Rear Left", "Rear Right"}
local wheelKeys = {"frontLeft", "frontRight", "rearLeft", "rearRight"}

-- Load presets from file
local function loadPresetsFromFile()
    if io.fileExists(configPath) then
        local file = io.open(configPath, "r")
        if file then
            local content = file:read("*all")
            file:close()
            local success, data = pcall(JSON.parse, content)
            if success and data then
                return data
            end
        end
    end
    return {default = stanceData}
end

-- Save presets to file
local function savePresetsToFile(presets)
    local file = io.open(configPath, "w")
    if file then
        file:write(JSON.stringify(presets, true))
        file:close()
        ac.log("Presets saved successfully")
    else
        ac.error("Failed to save presets")
    end
end

-- Initialize presets
availablePresets = loadPresetsFromFile()

-- Apply stance to car
local function applyStance()
    local car = ac.getCar(0)
    if not car then return end

    -- Apply to each wheel
    for i = 0, 3 do
        local wheelKey = wheelKeys[i + 1]
        local data = stanceData[wheelKey]

        -- Get wheel node
        local wheelNode = ac.findNodes("WHEEL_" .. i)
        if wheelNode then
            -- Apply offset (visual wheel position)
            local offsetVec = vec3(data.offset, data.rideHeight, data.trackWidth)
            wheelNode:setPosition(wheelNode:getPosition() + offsetVec)

            -- Apply camber (wheel rotation)
            local camberRot = math.rad(data.camber)
            local currentRot = wheelNode:getRotation()
            wheelNode:setRotation(quat.fromAngleAxis(camberRot, vec3(0, 0, 1)) * currentRot)
        end

        -- Apply to physics (if supported)
        if ac.setWheelOffset then
            ac.setWheelOffset(i, data.offset, data.trackWidth)
        end

        if ac.setWheelCamber then
            ac.setWheelCamber(i, data.camber)
        end

        if ac.setSuspensionTravel then
            ac.setSuspensionTravel(i, data.rideHeight)
        end
    end
end

-- Save current preset
local function savePreset(name)
    availablePresets[name] = {
        frontLeft = {
            offset = stanceData.frontLeft.offset,
            camber = stanceData.frontLeft.camber,
            trackWidth = stanceData.frontLeft.trackWidth,
            rideHeight = stanceData.frontLeft.rideHeight
        },
        frontRight = {
            offset = stanceData.frontRight.offset,
            camber = stanceData.frontRight.camber,
            trackWidth = stanceData.frontRight.trackWidth,
            rideHeight = stanceData.frontRight.rideHeight
        },
        rearLeft = {
            offset = stanceData.rearLeft.offset,
            camber = stanceData.rearLeft.camber,
            trackWidth = stanceData.rearLeft.trackWidth,
            rideHeight = stanceData.rearLeft.rideHeight
        },
        rearRight = {
            offset = stanceData.rearRight.offset,
            camber = stanceData.rearRight.camber,
            trackWidth = stanceData.rearRight.trackWidth,
            rideHeight = stanceData.rearRight.rideHeight
        }
    }
    savePresetsToFile(availablePresets)
end

-- Load preset
local function loadPreset(name)
    if availablePresets[name] then
        stanceData = {
            frontLeft = {
                offset = availablePresets[name].frontLeft.offset or 0,
                camber = availablePresets[name].frontLeft.camber or 0,
                trackWidth = availablePresets[name].frontLeft.trackWidth or 0,
                rideHeight = availablePresets[name].frontLeft.rideHeight or 0
            },
            frontRight = {
                offset = availablePresets[name].frontRight.offset or 0,
                camber = availablePresets[name].frontRight.camber or 0,
                trackWidth = availablePresets[name].frontRight.trackWidth or 0,
                rideHeight = availablePresets[name].frontRight.rideHeight or 0
            },
            rearLeft = {
                offset = availablePresets[name].rearLeft.offset or 0,
                camber = availablePresets[name].rearLeft.camber or 0,
                trackWidth = availablePresets[name].rearLeft.trackWidth or 0,
                rideHeight = availablePresets[name].rearLeft.rideHeight or 0
            },
            rearRight = {
                offset = availablePresets[name].rearRight.offset or 0,
                camber = availablePresets[name].rearRight.camber or 0,
                trackWidth = availablePresets[name].rearRight.trackWidth or 0,
                rideHeight = availablePresets[name].rearRight.rideHeight or 0
            }
        }
        applyStance()
        ac.log("Preset '" .. name .. "' loaded")
    end
end

-- Reset to default
local function resetStance()
    stanceData = {
        frontLeft = {offset = 0, camber = 0, trackWidth = 0, rideHeight = 0},
        frontRight = {offset = 0, camber = 0, trackWidth = 0, rideHeight = 0},
        rearLeft = {offset = 0, camber = 0, trackWidth = 0, rideHeight = 0},
        rearRight = {offset = 0, camber = 0, trackWidth = 0, rideHeight = 0}
    }
    applyStance()
end

-- Update function (called every frame)
function script.update(dt)
    applyStance()
end

-- UI Window
function script.windowMain(dt)
    ui.text("Real Time Stancer v1.0")
    ui.separator()

    -- Wheel selector
    ui.text("Select Wheel:")
    if ui.button("Front Left", vec2(100, 25)) then selectedWheel = 0 end
    ui.sameLine()
    if ui.button("Front Right", vec2(100, 25)) then selectedWheel = 1 end
    if ui.button("Rear Left", vec2(100, 25)) then selectedWheel = 2 end
    ui.sameLine()
    if ui.button("Rear Right", vec2(100, 25)) then selectedWheel = 3 end

    ui.separator()
    ui.text("Editing: " .. wheelNames[selectedWheel + 1])

    local wheelKey = wheelKeys[selectedWheel + 1]
    local data = stanceData[wheelKey]

    -- Sliders for adjustments
    ui.text("Wheel Offset:")
    local newOffset = ui.slider("##offset", data.offset, -0.2, 0.2, "Offset: %.3f m")
    if newOffset ~= data.offset then
        data.offset = newOffset
    end

    ui.text("Track Width:")
    local newTrack = ui.slider("##track", data.trackWidth, -0.2, 0.2, "Track: %.3f m")
    if newTrack ~= data.trackWidth then
        data.trackWidth = newTrack
    end

    ui.text("Camber:")
    local newCamber = ui.slider("##camber", data.camber, -15, 15, "Camber: %.1f°")
    if newCamber ~= data.camber then
        data.camber = newCamber
    end

    ui.text("Ride Height:")
    local newHeight = ui.slider("##height", data.rideHeight, -0.1, 0.1, "Height: %.3f m")
    if newHeight ~= data.rideHeight then
        data.rideHeight = newHeight
    end

    ui.separator()

    -- Quick actions
    if ui.button("Apply to All Wheels", vec2(200, 30)) then
        for _, key in ipairs(wheelKeys) do
            stanceData[key] = {
                offset = data.offset,
                camber = data.camber,
                trackWidth = data.trackWidth,
                rideHeight = data.rideHeight
            }
        end
    end

    if ui.button("Reset All", vec2(200, 30)) then
        resetStance()
    end

    ui.separator()

    -- Preset management
    ui.text("Presets:")

    if ui.button("Save Preset", vec2(95, 25)) then
        showSaveDialog = true
    end
    ui.sameLine()
    if ui.button("Load Preset", vec2(95, 25)) then
        showLoadDialog = true
    end

    -- Save dialog
    if showSaveDialog then
        ui.separator()
        ui.text("Preset Name:")
        presetName = ui.inputText("##presetname", presetName, ui.InputTextFlags.None)
        if ui.button("Save", vec2(90, 25)) then
            savePreset(presetName)
            showSaveDialog = false
        end
        ui.sameLine()
        if ui.button("Cancel", vec2(90, 25)) then
            showSaveDialog = false
        end
    end

    -- Load dialog
    if showLoadDialog then
        ui.separator()
        ui.text("Available Presets:")
        for name, _ in pairs(availablePresets) do
            if ui.button(name, vec2(190, 25)) then
                loadPreset(name)
                showLoadDialog = false
            end
        end
        if ui.button("Close", vec2(190, 25)) then
            showLoadDialog = false
        end
    end

    ui.separator()
    ui.text("CSP Version: " .. cspVersion)
end

-- Window settings
function script.windowMainSettings()
    return {
        title = "Real Time Stancer",
        size = vec2(400, 650),
        border = true,
        padding = vec2(10, 10)
    }
end
