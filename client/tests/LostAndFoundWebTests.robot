*** Settings ***
Documentation     End-to-End UAT Workflow: Student Report, Admin Return, and Admin Delete.
Library           SeleniumLibrary
Library           OperatingSystem
Library           String
Suite Setup       Setup Test Environment
Suite Teardown    Cleanup Test Environment

*** Variables ***
${BROWSER}            Chrome
${BASE_URL}           http://localhost:3000
${LOGIN_URL}          ${BASE_URL}/login
${REPORT_LOST_URL}    ${BASE_URL}/report-lost
${REPORT_FOUND_URL}   ${BASE_URL}/admin/report-found
${ADMIN_DASHBOARD_URL}  http://localhost:3000/admin/dashboard
${ADMIN_ITEMS_URL}      http://localhost:3000/admin/items
${ADMIN_OWNERLIST_URL}  http://localhost:3000/admin/ownerlist

# --- File Upload Path ---
${IMAGE_FILENAME}     test_proof.png
${IMAGE_PATH}         ${CURDIR}${/}${IMAGE_FILENAME}

# --- Authentication Credentials ---
${STUDENT_EMAIL}      student@g.siit.tu.ac.th
${STUDENT_PASSWORD}   Burger5$
${ADMIN_EMAIL}        admin@g.siit.tu.ac.th
${ADMIN_PASSWORD}     Password123!

# --- Static Data ---
${STUDENT_ID_VAL}     9999999999
${DATETIME_LOST}      2025-11-18T14:30
${CLAIMANT_NAME}      Test Claimant
${CLAIMANT_PHONE}     0812345678

# --- Locators ---
${LOGIN_FORM}         xpath=//form
${MENU_BUTTON}        xpath=//button[@aria-label="Menu"]
${LOGOUT_BUTTON}      xpath=//button[contains(@class, "logout-button")]
${EMAIL_INPUT}        name=username
${PASSWORD_INPUT}     name=password

# Forms
${LOST_SUBMIT_BUTTON}       xpath=//button[@type="submit" and text()="Submit Report"]
${FOUND_SUBMIT_BUTTON}      xpath=//button[@type="submit" and text()="Submit Report"]

# Identification / Mark Returned Locators
${MARK_RETURNED_BUTTON}     xpath=//button[contains(text(), "Mark Claimed/Returned")]
${ID_NAME_INPUT}            xpath=//input[@placeholder="Owner's name"]
${ID_RADIO_STUDENT}         xpath=//input[@type="radio" and @value="student"]
${ID_STUDENT_ID_INPUT}      xpath=//input[contains(@class, "student-id-input")]
${ID_TEL_INPUT}             xpath=//input[@placeholder="Phone number"]
${ID_FILE_INPUT}            xpath=//input[@type="file"]
${ID_SUBMIT_BUTTON}         xpath=//button[text()="Submit"]
${CONFIRM_YES_BUTTON}       xpath=//button[text()="Yes"]

# Delete Button Locator
${DELETE_BUTTON}            xpath=//button[text()="Delete"]

*** Test Cases ***

Test Case 1: Student Reporting Process (Report -> View List -> View Detail)
    [Documentation]    Verifies the Student's ability to report a lost item and view it.
    [Setup]    Generate Unique Item Names
    
    # 1. Login
    Login As Student
    
    # 2. Test Reporting Process
    Verify Student Can Report Lost Item    ${DYNAMIC_LOST_ITEM}
    
    # 3. Test List View Visibility
    Wait Until Location Is    ${BASE_URL}/home
    Wait Until Page Contains    All Item List
    
    # 4. Test Item Detail Navigation
    Verify Item Is Listed And Click    ${DYNAMIC_LOST_ITEM}
    
    # 5. Test Detail Content
    Verify Item Details Page Content    ${DYNAMIC_LOST_ITEM}    SIIT Main Building
    
    # 6. Logout
    Logout User

Test Case 2: Admin Resolution Process (Report -> View Detail -> Process Return -> Verify Owner List)
    [Documentation]    Verifies the Admin's ability to report found items and process a return.
    [Setup]    Generate Unique Item Names
    
    # 1. Login
    Login As Admin
    
    # 2. Test Reporting Process
    Verify Admin Can Report Found Item    ${DYNAMIC_FOUND_ITEM}
    
    # 3. Test List View Navigation
    Go To    ${ADMIN_ITEMS_URL}
    Wait Until Page Contains    All Item List
    
    # 4. Test Item Detail Navigation
    Verify Item Is Listed And Click    ${DYNAMIC_FOUND_ITEM}
    
    # 5. Test Detail Content
    Verify Item Details Page Content    ${DYNAMIC_FOUND_ITEM}    SIIT Main Building
    
    # 6. Test Return/Identification Process
    Execute Admin Return Process    ${CLAIMANT_NAME}
    
    # 7. Test Owner List Verification
    Verify Owner Verification List    ${CLAIMANT_NAME}
    
    # 8. Logout
    Logout User

Test Case 3: Admin Delete Item Process (Report -> Delete -> Verify Removal)
    [Documentation]    Verifies the Admin can delete an item and that it disappears from the list.
    [Setup]    Generate Unique Item Names
    
    # 1. Login
    Login As Admin
    
    # 2. Report a specific item to be deleted
    Verify Admin Can Report Found Item    ${DYNAMIC_DELETE_ITEM}
    
    # 3. Go to List and Verify it exists
    Go To    ${ADMIN_ITEMS_URL}
    Verify Item Is Listed And Click    ${DYNAMIC_DELETE_ITEM}
    
    # 4. Execute Delete Process (Handle Confirmations)
    Execute Admin Delete Process
    
    # 5. Verify Item is Gone
    Verify Item Is Deleted From List    ${DYNAMIC_DELETE_ITEM}
    
    # 6. Logout
    Logout User

*** Keywords ***

Setup Test Environment
    Set Selenium Implicit Wait    10s
    Create File    ${IMAGE_PATH}    dummy content for image upload test

Cleanup Test Environment
    Close All Browsers
    Remove File    ${IMAGE_PATH}

Generate Unique Item Names
    [Documentation]    Creates unique item names for every test run to avoid duplicates.
    ${RANDOM_ID}=    Generate Random String    5    [NUMBERS]
    Set Suite Variable    ${DYNAMIC_LOST_ITEM}     Blue Backpack Lost (Run ${RANDOM_ID})
    Set Suite Variable    ${DYNAMIC_FOUND_ITEM}    Blue Backpack Found (Run ${RANDOM_ID})
    Set Suite Variable    ${DYNAMIC_DELETE_ITEM}   Delete Test Item (Run ${RANDOM_ID})

# --- AUTHENTICATION PROCESSES ---

Login As Student
    Open Browser    ${LOGIN_URL}    ${BROWSER}
    Maximize Browser Window
    Delete All Cookies
    Wait Until Element Is Visible    ${EMAIL_INPUT}
    Input Text    ${EMAIL_INPUT}    ${STUDENT_EMAIL}
    Input Text    ${PASSWORD_INPUT}    ${STUDENT_PASSWORD}
    Submit Form    ${LOGIN_FORM}
    Wait Until Location Is    ${BASE_URL}/home

Login As Admin
    Open Browser    ${LOGIN_URL}    ${BROWSER}
    Maximize Browser Window
    Delete All Cookies
    Wait Until Element Is Visible    ${EMAIL_INPUT}
    Input Text    ${EMAIL_INPUT}    ${ADMIN_EMAIL}
    Input Text    ${PASSWORD_INPUT}    ${ADMIN_PASSWORD}
    Submit Form    ${LOGIN_FORM}
    Wait Until Location Is    ${ADMIN_DASHBOARD_URL}

Logout User
    Wait Until Element Is Visible    ${MENU_BUTTON}
    Click Element    ${MENU_BUTTON} 
    Wait Until Element Is Visible    ${LOGOUT_BUTTON}
    Click Element    ${LOGOUT_BUTTON}
    Wait Until Location Is    ${LOGIN_URL}

# --- CORE TEST PROCESSES ---

Verify Student Can Report Lost Item
    [Arguments]    ${ITEM_NAME}
    Go To    ${REPORT_LOST_URL}
    Wait Until Page Contains    Report Lost Item
    
    Input Text    xpath=//input[@placeholder="e.g., 6522771045"]    ${STUDENT_ID_VAL}
    Input Text    xpath=//input[@placeholder="e.g., iPhone 13 Pro"]    ${ITEM_NAME}
    Select From List By Value    xpath=(//select[@class="select-input"])[1]    Accessories
    Input Text    xpath=//input[@type="datetime-local"]    ${DATETIME_LOST}
    Sleep    0.5s
    Input Text    xpath=//input[@placeholder="e.g., SIIT Main Building Lobby"]    SIIT Main Building
    
    # 🚨 FIX: Scroll button into view to prevent interception
    Wait Until Element Is Visible    ${LOST_SUBMIT_BUTTON}
    Scroll Element Into View    ${LOST_SUBMIT_BUTTON}
    Sleep    0.5s
    Click Element    ${LOST_SUBMIT_BUTTON}
    
    Alert Should Be Present    Lost item reported successfully!

Verify Admin Can Report Found Item
    [Arguments]    ${ITEM_NAME}
    Go To    ${REPORT_FOUND_URL}
    Wait Until Page Contains    Report Found Item
    
    Input Text    xpath=//form[@class="rf-form"]//input[@placeholder="e.g., iPhone 13 Pro"]    ${ITEM_NAME}
    Input Text    xpath=//form[@class="rf-form"]//textarea[@class="rf-textarea"]    Description test.
    Select From List By Value    xpath=//form[@class="rf-form"]//select[@class="rf-input rf-select"]    Accessories
    Input Text    xpath=//input[@type="datetime-local"]    ${DATETIME_LOST}
    Sleep    0.5s
    Input Text    xpath=//input[@placeholder="e.g., Main Cafeteria..."]    SIIT Main Building
    
    # 🚨 FIX: Scroll button into view to prevent interception
    Wait Until Element Is Visible    ${FOUND_SUBMIT_BUTTON}
    Scroll Element Into View    ${FOUND_SUBMIT_BUTTON}
    Sleep    0.5s
    Click Element    ${FOUND_SUBMIT_BUTTON}
    
    Alert Should Be Present    SUCCESS! Item reported

Verify Item Is Listed And Click
    [Arguments]    ${ITEM_NAME_TO_CLICK}
    Wait Until Page Does Not Contain    Loading items...    timeout=15s
    
    ${CARD_TITLE_LOCATOR}=    Set Variable    xpath=//div[contains(@class, "card-title") and contains(., "${ITEM_NAME_TO_CLICK}")]
    
    Wait Until Element Is Visible    ${CARD_TITLE_LOCATOR}    timeout=10s
    Scroll Element Into View    ${CARD_TITLE_LOCATOR}
    Click Element    ${CARD_TITLE_LOCATOR}

Verify Item Details Page Content
    [Arguments]    ${EXPECTED_NAME}    ${EXPECTED_LOCATION}
    Wait Until Page Contains    ${EXPECTED_NAME} Details
    Wait Until Page Contains    ${EXPECTED_LOCATION}
    Wait Until Page Contains    Date Lost/Found:

Execute Admin Return Process
    [Arguments]    ${CLAIMANT_NAME}
    Wait Until Element Is Visible    ${MARK_RETURNED_BUTTON}
    Click Button    ${MARK_RETURNED_BUTTON}
    Wait Until Page Contains    Finalize Claim / Return
    
    Input Text    ${ID_NAME_INPUT}        ${CLAIMANT_NAME}
    Click Element    ${ID_RADIO_STUDENT}
    Input Text    ${ID_STUDENT_ID_INPUT}  ${STUDENT_ID_VAL}
    Input Text    ${ID_TEL_INPUT}         ${CLAIMANT_PHONE}
    
    Choose File   ${ID_FILE_INPUT}        ${IMAGE_PATH}
    
    # Scroll submit button into view
    Scroll Element Into View    ${ID_SUBMIT_BUTTON}
    Click Button    ${ID_SUBMIT_BUTTON}
    
    Wait Until Page Contains    Confirm marking item
    Click Button    ${CONFIRM_YES_BUTTON}
    
    # 🚨 FIX: Explicitly handle the success alert
    # We sleep briefly to ensure the alert is rendered by the browser
    Sleep    1s
    Handle Alert    action=ACCEPT
    
    Wait Until Location Is    ${ADMIN_ITEMS_URL}    timeout=10s

Verify Owner Verification List
    [Arguments]    ${CLAIMANT_NAME}
    Go To    ${ADMIN_OWNERLIST_URL}
    Wait Until Page Contains    Owner Verification Lists
    Wait Until Page Does Not Contain    Loading requests...
    
    Wait Until Page Contains    ${CLAIMANT_NAME}
    Wait Until Page Contains    ${STUDENT_ID_VAL}
    
    ${REVIEW_BTN}=    Set Variable    xpath=//div[contains(@class, "owner-claimant-name") and contains(text(), "${CLAIMANT_NAME}")]/following-sibling::div[@class="owner-action-row"]/button
    
    Scroll Element Into View    ${REVIEW_BTN}
    Click Element    ${REVIEW_BTN}
    
    Wait Until Page Contains    Review Verification Request
    Wait Until Page Contains    ${CLAIMANT_NAME}
    
    Click Button    xpath=//button[contains(text(), "Close Review")]

Execute Admin Delete Process
    [Documentation]    Clicks Delete, handles the 'Are you sure?' alert, and the 'Success' alert.
    Wait Until Element Is Visible    ${DELETE_BUTTON}
    Click Button    ${DELETE_BUTTON}
    
    # 1. Handle the Confirmation Dialog ("Are you sure?")
    Handle Alert    action=ACCEPT
    
    # 2. Wait for and Handle the Success Alert
    Sleep    1s
    Handle Alert    action=ACCEPT
    
    # 3. Verify redirection back to list
    Wait Until Location Is    ${ADMIN_ITEMS_URL}    timeout=10s

Verify Item Is Deleted From List
    [Arguments]    ${ITEM_NAME}
    [Documentation]    Ensures the item card is NO LONGER visible on the list page.
    Wait Until Page Does Not Contain    Loading items...
    Page Should Not Contain    ${ITEM_NAME}