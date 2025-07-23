/**
 * @see https://www.tak-dcxi.com/article/accessibility-conscious-tab-menu/
 */

export type TabsOptions = {
  tablistSelector: string | undefined;
  tabSelector: string | undefined;
  tabpanelSelector: string | undefined;
  firstView?: number;
};

const defaultOptions: TabsOptions = {
  tablistSelector: undefined,
  tabSelector: undefined,
  tabpanelSelector: undefined,
  firstView: 1,
};

const initializeTabs = (root: HTMLElement, options: TabsOptions = defaultOptions): void => {
  if (!root) {
    console.error('initializeTabs: Root element is not found.');
    return;
  }

  const mergedOptions = { ...defaultOptions, ...options };

  const tablist = root.querySelector(`${mergedOptions.tablistSelector}`) as HTMLElement;
  const tabs = root.querySelectorAll(`${mergedOptions.tabSelector}`) as NodeListOf<HTMLAnchorElement>;
  const tabpanels = root.querySelectorAll(`${mergedOptions.tabpanelSelector}`) as NodeListOf<HTMLElement>;

  if (!tablist || tabs.length === 0 || tabpanels.length === 0) {
    console.error('initializeTabs: Required elements for tabs are missing or invalid.');
    return;
  }

  const initialIndex = Math.max(0, (mergedOptions.firstView ?? 1) - 1);

  setTabAttributes(tablist, tabs, tabpanels);
  activateTab(tabs, tabpanels, initialIndex);

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (event) => handleClick(event, tabs, tabpanels, index), false);
    tab.addEventListener('keyup', (event) => handleKeyNavigation(event, tablist, tabs, tabpanels, index), false);
  });

  tabpanels.forEach((panel) => {
    panel.addEventListener('beforematch', (event) => handleBeforeMatch(event, tabs, tabpanels), true);
  });
};

const setTabAttributes = (tablist: HTMLElement, tabs: NodeListOf<HTMLAnchorElement>, tabpanels: NodeListOf<HTMLElement>): void => {
  tablist.setAttribute('role', 'tablist');

  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('aria-controls', tabpanels[index].id);
    tab.setAttribute('tabindex', '-1');
  });

  tabpanels.forEach((tabpanel) => {
    tabpanel.setAttribute('role', 'tabpanel');
  });
};

const activateTab = (tabs: NodeListOf<HTMLAnchorElement>, tabpanels: NodeListOf<HTMLElement>, index: number): void => {
  tabs.forEach((tab, i) => {
    const isSelected = i === index;
    tab.setAttribute('aria-selected', String(isSelected));
    tab.setAttribute('tabindex', isSelected ? '0' : '-1');
  });

  tabpanels.forEach((tabpanel, i) => {
    if (i !== index) {
      tabpanel.setAttribute('hidden', 'until-found');
      tabpanel.removeAttribute('tabindex');
    } else {
      tabpanel.removeAttribute('hidden');
      tabpanel.setAttribute('tabindex', '0');
    }
  });
};

const handleClick = (event: MouseEvent, tabs: NodeListOf<HTMLAnchorElement>, tabpanels: NodeListOf<HTMLElement>, index: number): void => {
  event.preventDefault();
  activateTab(tabs, tabpanels, index);
};

const handleKeyNavigation = (event: KeyboardEvent, tablist: HTMLElement, tabs: NodeListOf<HTMLAnchorElement>, tabpanels: NodeListOf<HTMLElement>, currentIndex: number): void => {
  const orientation = tablist.getAttribute('aria-orientation') || 'horizontal';

  const keyActions: Record<string, () => number> = {
    [orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft']: () => (currentIndex - 1 >= 0 ? currentIndex - 1 : tabs.length - 1),
    [orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight']: () => (currentIndex + 1) % tabs.length,
    Home: () => 0,
    End: () => tabs.length - 1,
  };

  const action = keyActions[event.key];

  if (action) {
    event.preventDefault();
    const newIndex = action();
    tabs[newIndex].focus();
    activateTab(tabs, tabpanels, newIndex);
  }
};

const handleBeforeMatch = (event: Event, tabs: NodeListOf<HTMLAnchorElement>, tabpanels: NodeListOf<HTMLElement>): void => {
  const panel = event.currentTarget as HTMLElement;
  const tabIndex = [...tabpanels].indexOf(panel);

  if (tabIndex !== -1) {
    activateTab(tabs, tabpanels, tabIndex);
  }
};

export default initializeTabs;
