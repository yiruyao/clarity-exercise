import {useCallback, useState} from "react";
import { NavTabs, TabConfig } from "./components/NavTabs";
import { Feedback } from "./Feedback";
import { Groups } from "./Groups";
import { FilterBar } from "./components/FilterBar";
import { FilterItemsMap } from '../../shared/types';

export const TabsConfig: TabConfig = {
  feedback: {
    id: "feedback",
    name: "Feedback",
  },
  groups: {
    id: "groups",
    name: "Groups",
  },
};

function App() {
  const [selectedTab, setSelectedTab] = useState("feedback");
  const [filterItems, setFilterItems] = useState<FilterItemsMap>({});

  const updateFilterItems = useCallback((newFilterItems:FilterItemsMap) => {
    setFilterItems(newFilterItems);
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-5/6 h-4/5 flex flex-col gap-y-4">
        <NavTabs
          config={TabsConfig}
          tabOrder={["feedback", "groups"]}
          onTabClicked={(tabId) => {
            setSelectedTab(tabId);
          }}
          selectedTab={selectedTab}
        />
        {/**
         * TODO(part-1): Add filtr options
         */}
        <FilterBar filterItems={filterItems} updateFilterItems={updateFilterItems}/>
        {selectedTab === "feedback" ? (
          <Feedback filters={filterItems} />
        ) : (
          <Groups filters={filterItems} />
        )}
      </div>
    </div>
  );
}

export default App;
