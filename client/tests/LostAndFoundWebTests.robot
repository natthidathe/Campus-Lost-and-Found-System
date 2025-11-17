*** Settings ***
Documentation     End-to-End Workflow: Student Report -> Detail, then Admin Report -> Detail -> Identification -> Owner List.
Library           SeleniumLibrary
Library           OperatingSystem
Suite Setup       Setup Environment
Suite Teardown    Cleanup Environment

*** Variables ***
${BROWSER}            Chrome
${BASE_URL}           http://localhost:3000
${LOGIN_URL}          ${BASE_URL}/login
${REPORT_LOST_URL}    ${BASE_URL}/report-lost
${REPORT_FOUND_URL}   ${BASE_URL}/admin/report-found
${ADMIN_DASHBOARD_URL}  http://localhost:3000/admin/dashboard
${ADMIN_ITEMS_URL}      http://localhost:3000/admin/items
${ADMIN_OWNERLIST_URL}  http://localhost:3000/admin/ownerlist

# --- File Upload Path (Creates a dummy image in the current directory) ---
${IMAGE_FILENAME}     test_proof.png
${IMAGE_PATH}         ${CURDIR}${/}${IMAGE_FILENAME}

# --- Authentication Credentials ---
${STUDENT_EMAIL}      student@g.siit.tu.ac.th
${STUDENT_PASSWORD}   Burger5$
${ADMIN_EMAIL}        admin@g.siit.tu.ac.th
${ADMIN_PASSWORD}     Password123!

# --- Unique Item Data ---
${LOST_ITEM_NAME}     Blue Backpack Lost (E2E)
${FOUND_ITEM_NAME}    Blue Backpack Found (E2E)
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

*** Test Cases ***

Test Case 1: Student Complete Workflow (Report -> Home -> Detail)
    [Documentation]    Student logs in, reports an item, is redirected to Home, sees the item card, and clicks it to view details.
    
    # 1. Login
    Go To Login Page
    Login As Student
    
    # 2. Report Lost Item
    Go To Report Lost Page
    Report Lost Item Successfully
    
    # 3. Verify Redirect to Home and Card Visibility
    Wait Until Location Is    ${BASE_URL}/home
    Wait Until Page Contains    All Item List
    
    # 4. Click the specific item card to see details
    Click Item Card On List Page    ${LOST_ITEM_NAME}
    
    # 5. Verify Detail Page Content
    Verify Item Details Page    ${LOST_ITEM_NAME}    SIIT Main Building
    
    # 6. Logout
    Logout User

Test Case 2: Admin Complete Workflow (Report -> Detail -> Mark Returned -> Owner List)
    [Documentation]    Admin reports found item, views it, marks it as returned (identification), and verifies the record in Owner List.
    
    # 1. Login
    Go To Login Page
    Login As Admin
    
    # 2. Report Found Item
    Go To Report Found Page
    Report Found Item Successfully
    
    # 3. Go to Admin Item List to verify card
    Go To    ${ADMIN_ITEMS_URL}
    Wait Until Page Contains    All Item List
    
    # 4. Click the specific item card
    Click Item Card On List Page    ${FOUND_ITEM_NAME}
    
    # 5. Verify Detail Page
    Verify Item Details Page    ${FOUND_ITEM_NAME}    SIIT Main Building
    
    # 6. Mark as Returned / Identification Flow
    Click Button    ${MARK_RETURNED_BUTTON}
    Wait Until Page Contains    Finalize Claim / Return
    
    # Fill Identification Form
    Input Text    ${ID_NAME_INPUT}        ${CLAIMANT_NAME}
    Click Element    ${ID_RADIO_STUDENT}
    Input Text    ${ID_STUDENT_ID_INPUT}  ${STUDENT_ID_VAL}
    Input Text    ${ID_TEL_INPUT}         ${CLAIMANT_PHONE}
    
    # 🚨 UPLOAD IMAGE STEP: Choose the dummy file created in Setup 🚨
    Choose File   ${ID_FILE_INPUT}        ${IMAGE_PATH}
    
    # Submit and Confirm
    Click Button    ${ID_SUBMIT_BUTTON}
    Wait Until Page Contains    Confirm marking item
    Click Button    ${CONFIRM_YES_BUTTON}
    
    # Handle Alert if present (Success message)
    Run Keyword And Ignore Error    Handle Alert
    
    # 7. Verify Redirect to Item List (code behavior)
    Wait Until Location Is    ${ADMIN_ITEMS_URL}
    
    # 8. Go to Owner List to verify the record
    Go To    ${ADMIN_OWNERLIST_URL}
    Wait Until Page Contains    Owner Verification Lists
    
    # 9. Verify the Request Exists and Open Review
    Verify And Open Owner Review    ${CLAIMANT_NAME}
    
    # 10. Logout
    Logout User

*** Keywords ***

Setup Environment
    Set Selenium Implicit Wait    10s
    # Create a dummy image file for testing uploads so the test is self-contained
    Create File    ${IMAGE_PATH}    dummy content for image upload test

Cleanup Environment
    Close All Browsers
    # Remove the dummy file to keep the environment clean
    Remove File    ${IMAGE_PATH}

Go To Login Page
    Open Browser    ${LOGIN_URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${EMAIL_INPUT}

Logout User
    Wait Until Element Is Visible    ${MENU_BUTTON}
    Click Element    ${MENU_BUTTON} 
    Wait Until Element Is Visible    ${LOGOUT_BUTTON}
    Click Element    ${LOGOUT_BUTTON}
    Wait Until Location Is    ${LOGIN_URL}

Login As Student
    Wait Until Element Is Visible    ${EMAIL_INPUT}
    Input Text    ${EMAIL_INPUT}    ${STUDENT_EMAIL}
    Input Text    ${PASSWORD_INPUT}    ${STUDENT_PASSWORD}
    Submit Form    ${LOGIN_FORM}
    Wait Until Location Is    ${BASE_URL}/home

Login As Admin
    Wait Until Element Is Visible    ${EMAIL_INPUT}
    Input Text    ${EMAIL_INPUT}    ${ADMIN_EMAIL}
    Input Text    ${PASSWORD_INPUT}    ${ADMIN_PASSWORD}
    Submit Form    ${LOGIN_FORM}
    Wait Until Location Is    ${ADMIN_DASHBOARD_URL}

Go To Report Lost Page
    Go To    ${REPORT_LOST_URL}
    Wait Until Page Contains    Report Lost Item

Report Lost Item Successfully
    [Documentation]    Fills form and ensures success alert appears.
    Input Text    xpath=//input[@placeholder="e.g., 6522771045"]    ${STUDENT_ID_VAL}
    Input Text    xpath=//input[@placeholder="e.g., iPhone 13 Pro"]    ${LOST_ITEM_NAME}
    Select From List By Value    xpath=(//select[@class="select-input"])[1]    Accessories
    Input Text    xpath=//input[@type="datetime-local"]    ${DATETIME_LOST}
    Sleep    0.5s
    Input Text    xpath=//input[@placeholder="e.g., SIIT Main Building Lobby"]    SIIT Main Building
    
    Wait Until Element Is Visible    ${LOST_SUBMIT_BUTTON}
    Click Element    ${LOST_SUBMIT_BUTTON}
    
    Alert Should Be Present    Lost item reported successfully!

Go To Report Found Page
    Go To    ${REPORT_FOUND_URL}
    Wait Until Page Contains    Report Found Item

Report Found Item Successfully
    [Documentation]    Fills form and ensures success alert appears.
    Input Text    xpath=//form[@class="rf-form"]//input[@placeholder="e.g., iPhone 13 Pro"]    ${FOUND_ITEM_NAME}
    Input Text    xpath=//form[@class="rf-form"]//textarea[@class="rf-textarea"]    Description test.
    Select From List By Value    xpath=//form[@class="rf-form"]//select[@class="rf-input rf-select"]    Accessories
    Input Text    xpath=//input[@type="datetime-local"]    ${DATETIME_LOST}
    Sleep    0.5s
    Input Text    xpath=//input[@placeholder="e.g., Main Cafeteria..."]    SIIT Main Building
    
    Wait Until Element Is Visible    ${FOUND_SUBMIT_BUTTON}
    Click Element    ${FOUND_SUBMIT_BUTTON}
    
    Alert Should Be Present    SUCCESS! Item reported

Click Item Card On List Page
    [Arguments]    ${ITEM_NAME_TO_CLICK}
    [Documentation]    Waits for loading to finish, scrolls to the card title, and clicks it.
    
    # 1. Wait for loading overlay to disappear
    Wait Until Page Does Not Contain    Loading items...    timeout=15s
    
    # 2. Define robust XPath using dot (.) to match text content inside the div
    ${CARD_TITLE_LOCATOR}=    Set Variable    xpath=//div[contains(@class, "card-title") and contains(., "${ITEM_NAME_TO_CLICK}")]
    
    # 3. Wait until the specific card is in the DOM
    Wait Until Element Is Visible    ${CARD_TITLE_LOCATOR}    timeout=10s
    
    # 4. Scroll it into view to prevent "Element Not Interactable"
    Scroll Element Into View    ${CARD_TITLE_LOCATOR}
    
    # 5. Click
    Click Element    ${CARD_TITLE_LOCATOR}

Verify Item Details Page
    [Arguments]    ${EXPECTED_NAME}    ${EXPECTED_LOCATION}
    [Documentation]    Verifies we are on the detail page and see correct info.
    Wait Until Page Contains    ${EXPECTED_NAME} Details
    Wait Until Page Contains    ${EXPECTED_LOCATION}
    Wait Until Page Contains    Date Lost/Found:

Verify And Open Owner Review
    [Arguments]    ${CLAIMANT_NAME}
    [Documentation]    Finds the request card by claimant name and clicks Open Review.
    
    # Wait for list to load
    Wait Until Page Does Not Contain    Loading requests...    timeout=10s
    
    # Define locator for the specific claimant name card
    ${NAME_LOCATOR}=    Set Variable    xpath=//div[contains(@class, "owner-claimant-name") and contains(text(), "${CLAIMANT_NAME}")]
    Wait Until Element Is Visible    ${NAME_LOCATOR}
    Scroll Element Into View    ${NAME_LOCATOR}
    
    # Find the 'Open Review' button associated with this card (sibling relationship)
    ${REVIEW_BTN}=    Set Variable    xpath=//div[contains(@class, "owner-claimant-name") and contains(text(), "${CLAIMANT_NAME}")]/following-sibling::div[@class="owner-action-row"]/button
    
    Click Element    ${REVIEW_BTN}
    
    # Verify Modal Opened
    Wait Until Page Contains    Review Verification Request
    Wait Until Page Contains    ${CLAIMANT_NAME}
    Wait Until Page Contains    ${STUDENT_ID_VAL}
    
    # Close Modal
    Click Button    xpath=//button[contains(text(), "Close Review")]