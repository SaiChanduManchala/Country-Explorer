# Country Explorer

## Project Overview

The **Country Explorer** is an interactive web application that allows users to explore various countries using the REST Countries API. Users can search for countries, view detailed information, and manage a favorites list. The application is designed to be responsive and user-friendly, making it suitable for a wide range of devices.

## Features

- **Country Cards**: Displays a grid of country cards, each showing the country's flag and name.
  <div style="text-align: center; margin: 20px 0;">
    <img src="https://github.com/user-attachments/assets/ca61e03a-d92b-47c1-bc96-8d6e9402348c" width="300" style="margin: 10px;" />
  </div>

- **Search Functionality**: Users can search for countries by name or filter by region and language.
  <div style="text-align: center; margin: 20px 0;">
    <img src="https://github.com/user-attachments/assets/3d5dea01-c191-44b8-b42c-a56199e63c00" width="300" style="margin: 10px;" />
  </div>

- **Details Page**: Clicking on a country card takes the user to a detailed view, which includes a map, additional country information, and an 'Add to Favorites' button.
  <div style="text-align: center; margin: 20px 0;">
    <img src="https://github.com/user-attachments/assets/15adaf00-19bf-47b8-a0f8-a932fd306068" width="300" style="margin: 10px;" />
  </div>

- **Favorites Section**: Users can save their favorite countries, which are displayed separately on the main page.
- When all favorites are removed, the section will automatically hide until a new favorite is added.
  <div style="text-align: center; margin: 20px 0;">
    <img src="https://github.com/user-attachments/assets/88cfc55e-dbce-48e7-98ba-3f663646093c" width="300" style="margin: 10px;" />
  </div>

- **Responsive Design**: The application adjusts to different screen sizes for optimal viewing on mobile and desktop devices.
- **Tech Stack**: This website is built using HTML, CSS, and JavaScript.



## Setup Instructions

To set up the Country Explorer project locally, follow these steps:

### 1.  **Clone the Repository**:
   
   `git clone https://github.com/yourusername/country-explorer.git
   cd country-explorer`

### 2.  Open in VS Code:

- Open Visual Studio Code (VS Code).
- Click on "File" > "Open Folder..." and select the cloned project folder.
### 3. Open index.html:

- In the Explorer pane, find and open the index.html file.
### 4. Launch the Application:

- Open the index.html file in your preferred web browser. You can do this by right-clicking on the file and selecting "Open with Live Server" if you have the Live Server extension installed.
## Design Decisions
- Modular Code Structure: The JavaScript code is organized into separate modules to promote reusability and maintainability.
- Responsive Design: CSS media queries are used to ensure the application looks great on devices of all sizes.
- User Experience: The design prioritizes intuitive navigation and easy access to functionalities, such as filtering and searching.
- Favorites Management: The 'Add to Favorites' button changes to a red heart shape when clicked, providing visual feedback. A confirmation message appears upon adding/removing a country from favorites.
- UI Enhancements: The search bar width has been increased for better visibility, and the layout has been adjusted to eliminate congestion.

## Browser Compatibility
The Country Explorer application has been tested and works across major browsers, including:

- Google Chrome
- Mozilla Firefox
- Apple Safari

The application is designed to be responsive on various devices, ensuring a seamless user experience. However, some features may behave differently on older versions of browsers. Ensure you are using the latest versions for optimal performance.

## Conclusion
Thank you for exploring the Country Explorer project! Feel free to contribute or provide feedback. For any questions or issues, please open an issue on the GitHub repository.
