// HOME PAGE 
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.topnavbar') // Select the nav element
  if (window.scrollY > 0) { // Check if scrolled more than 0 pixels
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// SUBJECT PAGE //
// ----------------------------------------------------------------------------------------------------------------------------------------------//
// *Subject page setup*
// We wait for DOMContentLoaded because JavaScript can't find HTML elements until they exist
document.addEventListener('DOMContentLoaded', function() {
    
    var allTabs = document.querySelectorAll('.standard-tab');
    
    // We loop through tabs to hide/show them by themselves because each tab has a different "level", and we only want Level 2 visible at start.
    for (var i = 0; i < allTabs.length; i++) {
        var currentTab = allTabs[i];
        
        // We check the level attribute to decide whether the tab should be visible
        if (currentTab.dataset.level === '2') {
            currentTab.style.display = 'block'; // Show
        } else {
            currentTab.style.display = 'none'; // Hide
        }
    }
    
    var firstLevel2Tab = document.querySelector('.standard-tab[data-level="2"]');
    
    // We auto-click the first visible tab so users see content instead of nothing, as the "default"
    if (firstLevel2Tab) {
        firstLevel2Tab.click();
    }
});

//----------------------------------------------------------------------------------------------------------------------------------------------//

// * Level Switcher * //

// Find all the buttons that change level 
var levelButtons = document.querySelectorAll('.level-btn');

// Add a click event to each button so that users can switch between level 2 and level 3 content without reloading the page. 
for (var i = 0; i < levelButtons.length; i++) {
    levelButtons[i].addEventListener('click', function() {
        
        // We clear the "active" class from all buttons so that there is no confusion, then add the active tab to the clicked tab. 
        var allLevelBtns = document.querySelectorAll('.level-btn');
        for (var j = 0; j < allLevelBtns.length; j++) {
            allLevelBtns[j].classList.remove('active');
        }
        this.classList.add('active');
        
        // Get the level number from the clicked button
        var selectedLevel = this.dataset.level;
        
        // We filter the tabs by level so that users only see the standards that relevant to the level, in order to keep the interface intuitive and clean
        var allTabs = document.querySelectorAll('.standard-tab');
        for (var k = 0; k < allTabs.length; k++) {
            var tab = allTabs[k];
            if (tab.dataset.level === selectedLevel) {
                tab.style.display = 'block';  // Show matching tabs 
            } else {
                tab.style.display = 'none';   // Hide irrelavent tabs
            }
        }
        
        // Always click the first visible tab so that there is a "default" and users aren't met with an empty page. 
        var firstVisibleTab = document.querySelector('.standard-tab[data-level="' + selectedLevel + '"]');
        if (firstVisibleTab) {
            firstVisibleTab.click();
        }
    });
}

// -------------------------------------------------------------------------------------------------------------------------------------//
// * Standards Switcher *
// We add events to each tab so clicking one automatically shows the page and then the resrouces that we need
var standardTabs = document.querySelectorAll('.standard-tab');

// Loop logic
for (var i = 0; i < standardTabs.length; i++) {
    standardTabs[i].addEventListener('click', function() {
        
        // This code highlights the standard tab
        // Same as before: we remove the active class from all the tabs, and then add the active class to the one that is clicked
        var allTabs = document.querySelectorAll('.standard-tab');
        for (var j = 0; j < allTabs.length; j++) {
            allTabs[j].classList.remove('active');
        }
        this.classList.add('active');
        
        // We pull the standard's ID, code, and description from data attributes from the database so we can dynamically update the page without hardcoding 
        var standardId = this.dataset.standardId;
        var code = this.dataset.standard;
        var description = this.dataset.description;
        
        // This changes the heading so that it matches the standard that is selected
        var titleElement = document.querySelector('.standard-title');
        titleElement.textContent = code + ' — ' + description;
        
        // Shows the resource cards that are matched to the current standard
        var resourceCards = document.querySelectorAll('.resource-card');
        var visibleCount = 0;
        
        for (var k = 0; k < resourceCards.length; k++) {
            var card = resourceCards[k];
            
            if (card.dataset.standard === standardId) {
                card.style.display = 'block';  // Show relevant resources
                visibleCount = visibleCount + 1;  // Track count for badge
            } else {
                card.style.display = 'none';  // Hide unrelated resources
            }
        }
        
        // Display how many resources are available so users can make an informed decision about this standard
        var countBadge = document.getElementById('resource-count-badge');
        countBadge.textContent = visibleCount + ' resources';
        
        // Update all pill counts for the current standard before filtering
        var allPills = document.querySelectorAll('.filter-pill');
        for (var m = 0; m < allPills.length; m++) {
            var pill = allPills[m];
            var pillFilter = pill.dataset.filter;
            var pillCount = 0;
            
            if (pillFilter === 'all') {
                // "All" pill shows count of all resources in this standard
                pillCount = visibleCount;
            } else {
                // Count resources matching this category in the current standard
                for (var n = 0; n < resourceCards.length; n++) {
                    if (resourceCards[n].dataset.standard === standardId && 
                        resourceCards[n].dataset.category === pillFilter) {
                        pillCount++;
                    }
                }
            }
            
            var pillCountSpan = pill.querySelector('.pill-count');
            if (pillCountSpan) {
                pillCountSpan.textContent = pillCount;
            }
        }
        
        // We clear any active filters and select "All" when switching standards because preselecting a resource type would be confusing
        var filterPills = document.querySelectorAll('.filter-pill');
        for (var m = 0; m < filterPills.length; m++) {
            filterPills[m].classList.remove('active');
        }
        var allFilter = document.querySelector('.filter-pill[data-filter="all"]');
        if (allFilter) {
            allFilter.classList.add('active');
            allFilter.click()
        }
    });
}
//-----------------------------------------------------------------------------------------------------------------------------//
// * Pill Display *
// We add events to each pill so users can change resource type without hard refreshing the page, thus losing their stand selection
var filterPills = document.querySelectorAll('.filter-pill');

for (var i = 0; i < filterPills.length; i++) {
    filterPills[i].addEventListener('click', function() {
      
        // We update the active state so users can see which category filter is applied currently 
        var allPills = document.querySelectorAll('.filter-pill');
        for (var j = 0; j < allPills.length; j++) {
            allPills[j].classList.remove('active');
        }
        this.classList.add('active');
        
        var selectedFilter = this.dataset.filter;
        
        // We check which standard tab is selected so we can apply the category filter without losing the standard filter, so we can use both filters
        var activeStandardTab = document.querySelector('.standard-tab.active');
        var activeStandardId = null;
        if (activeStandardTab) {
            activeStandardId = activeStandardTab.dataset.standardId;
        }
        
        // We check BOTH category and standard so that users can check for both like Videos in Calculus etc.
        var resourceCards = document.querySelectorAll('.resource-card');
        
        // We need to track how many cards pass both filters so the badge stays accurate after filtering
        var visibleCount = 0;
        
        for (var k = 0; k < resourceCards.length; k++) {
            var card = resourceCards[k];
            
            // Does card match the selected category?
            var matchesCategory = false;
            if (selectedFilter === 'all') {
                matchesCategory = true;  // "All" bypasses category filtering
            } else if (card.dataset.category === selectedFilter) {
                matchesCategory = true;  // Card matches chosen category
            }
            
            // Does card match the active standard?
            var matchesStandard = true;  // Default: show if no standard selected
            if (activeStandardId) {
                // If a standard is active, only show cards for that standard
                matchesStandard = (card.dataset.standard === activeStandardId);
            }
            
            // Show card only if it passes both filters
            if (matchesCategory && matchesStandard) {
                card.style.display = 'block';
                visibleCount = visibleCount + 1;  
            } else {
                card.style.display = 'none';
            }
        }
        
        // We update the badge here because the filtering will change how many resources are visible. 
        var countBadge = document.getElementById('resource-count-badge');
        countBadge.textContent = visibleCount + ' resources';
        
        // Update all pill counts based on the current filter + standard combination 
        var allFilterPills = document.querySelectorAll('.filter-pill');
        for (var m = 0; m < allFilterPills.length; m++) {
            var pill = allFilterPills[m];
            var pillFilter = pill.dataset.filter;
            var pillCount = 0;
            
            // Count resources matching this category in the active standard
            for (var n = 0; n < resourceCards.length; n++) {
                var card = resourceCards[n];
                var matchesCategory = false;
                
                if (pillFilter === 'all') {
                    matchesCategory = true;
                } else if (card.dataset.category === pillFilter) {
                    matchesCategory = true;
                }
                
                var matchesStandard = true;
                if (activeStandardId) {
                    matchesStandard = (card.dataset.standard === activeStandardId);
                }
                
                if (matchesCategory && matchesStandard) {
                    pillCount++;
                }
            }
            
            var pillCountSpan = pill.querySelector('.pill-count');
            if (pillCountSpan) {
                pillCountSpan.textContent = pillCount;
            }
        }
    });
}