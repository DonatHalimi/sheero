import {
    AllInbox,
    AllInboxOutlined,
    Apartment,
    ApartmentOutlined,
    Category,
    CategoryOutlined,
    Collections,
    CollectionsOutlined,
    Contacts,
    ContactsOutlined,
    DryCleaning,
    DryCleaningOutlined,
    Explore,
    ExploreOutlined,
    Flag,
    FlagOutlined,
    Help,
    HelpOutlineOutlined,
    Inbox,
    InboxOutlined,
    Inventory,
    Inventory2Outlined,
    Mail,
    MailOutlined,
    MoveToInbox,
    MoveToInboxOutlined,
    People,
    PeopleOutlineOutlined,
    Person,
    PersonOutline,
    PrecisionManufacturing,
    PrecisionManufacturingOutlined,
    Room,
    RoomOutlined,
    Star,
    StarHalf,
    Widgets,
    WidgetsOutlined,
} from "@mui/icons-material";

// User related pages
export const userMenuItems = [
    {
        id: 'users',
        icon: { active: Person, inactive: PersonOutline },
        label: 'Users'
    },
    {
        id: 'roles',
        icon: { active: People, inactive: PeopleOutlineOutlined },
        label: 'Roles'
    },
    {
        id: 'orders',
        icon: { active: Inbox, inactive: InboxOutlined },
        label: 'Orders'
    },
    {
        id: 'returns',
        icon: { active: MoveToInbox, inactive: MoveToInboxOutlined },
        label: 'Returns'
    },
    {
        id: 'reviews',
        icon: { active: Star, inactive: StarHalf },
        label: 'Reviews'
    },
];

// Product related pages
export const productMenuItems = [
    {
        id: 'products',
        icon: { active: DryCleaning, inactive: DryCleaningOutlined },
        label: 'Products'
    },
    {
        id: 'images',
        icon: { active: Collections, inactive: CollectionsOutlined },
        label: 'Images'
    },
    {
        id: 'faqs',
        icon: { active: Help, inactive: HelpOutlineOutlined },
        label: 'FAQs'
    },
    {
        id: 'contacts',
        icon: { active: Contacts, inactive: ContactsOutlined },
        label: 'Contacts'
    },
];

// Newsletter related pages
export const newsLetterMenuItems = [
    {
        id: 'productRestockSubscriptions',
        icon: { active: Inventory, inactive: Inventory2Outlined },
        label: 'Restock'
    }
]

// Category related pages
export const categoryMenuItems = [
    {
        id: 'categories',
        icon: { active: Inbox, inactive: InboxOutlined },
        label: 'Categories'
    },
    {
        id: 'subcategories',
        icon: { active: Widgets, inactive: WidgetsOutlined },
        label: 'Subcategories'
    },
    {
        id: 'subsubcategories',
        icon: { active: Category, inactive: CategoryOutlined },
        label: 'Subsubcategories'
    },
];

// Address related pages
export const addressMenuItems = [
    {
        id: 'countries',
        icon: { active: Flag, inactive: FlagOutlined },
        label: 'Countries'
    },
    {
        id: 'cities',
        icon: { active: Apartment, inactive: ApartmentOutlined },
        label: 'Cities'
    },
    {
        id: 'addresses',
        icon: { active: Room, inactive: RoomOutlined },
        label: 'Addresses'
    },
    {
        id: 'suppliers',
        icon: { active: PrecisionManufacturing, inactive: PrecisionManufacturingOutlined },
        label: 'Suppliers'
    },
];

// Collapsible sections
export const mainSections = [
    {
        id: 'users',
        icon: { active: People, inactive: PeopleOutlineOutlined },
        label: 'User',
        items: userMenuItems,
        stateKey: 'usersOpen'
    },
    {
        id: 'products',
        icon: { active: Inventory, inactive: Inventory2Outlined },
        label: 'Product',
        items: productMenuItems,
        stateKey: 'productsOpen'
    },
    {
        id: 'categories',
        icon: { active: AllInbox, inactive: AllInboxOutlined },
        label: 'Category',
        items: categoryMenuItems,
        stateKey: 'categoriesOpen'
    },
    {
        id: 'newsletters',
        icon: { active: Mail, inactive: MailOutlined },
        label: 'Newsletters',
        items: newsLetterMenuItems,
        stateKey: 'newslettersOpen'
    },
    {
        id: 'addresses',
        icon: { active: Explore, inactive: ExploreOutlined },
        label: 'Address',
        items: addressMenuItems,
        stateKey: 'addressesOpen'
    },
];