import { Typography, TextField, Collapse, IconButton, Box, Button, Switch } from '@mui/material';
import { ExpandMore, ExpandLess, PaidOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import { OutlinedBrownButton, SidebarLayout } from '../../assets/CustomComponents';

const FilterSidebar = ({ onApplyPriceFilter }) => {
    const [priceFilterOpen, setPriceFilterOpen] = useState(true);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    // const [onSaleOnly, setOnSaleOnly] = useState(false);

    const handlePriceRangeChange = (event) => {
        const { name, value } = event.target;
        setPriceRange(prev => ({ ...prev, [name]: value }));
    };

    const applyFilter = () => {
        onApplyPriceFilter(priceRange);
    };

    // const handleToggleChange = () => {
    //     setOnSaleOnly(prev => !prev);
    // };

    return (
        <SidebarLayout>
            <div className="mt-1">
                {/* <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1" className="mr-2">On Sale Only</Typography>
                    <Switch
                        checked={onSaleOnly}
                        onChange={handleToggleChange}
                        color="primary"
                    />
                </Box> */}

                <div onClick={() => setPriceFilterOpen(!priceFilterOpen)} className="flex items-center justify-between p-1 cursor-pointer border-t border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <PaidOutlined color='primary' />
                        <Typography variant="subtitle1">Filter by Price</Typography>
                    </div>
                    <IconButton size="small">
                        {priceFilterOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </div>

                <Collapse in={priceFilterOpen}>
                    <div className="flex flex-col gap-2 mt-2">
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 2 }, mt: 1 }}>
                            <TextField
                                label="Min Price"
                                variant="outlined"
                                size="small"
                                name="min"
                                value={priceRange.min}
                                onChange={handlePriceRangeChange}
                            />
                            <TextField
                                label="Max Price"
                                variant="outlined"
                                size="small"
                                name="max"
                                value={priceRange.max}
                                onChange={handlePriceRangeChange}
                            />
                        </Box>

                        <Button variant="contained" onClick={applyFilter} className='!mt-2'>
                            Apply Filter
                        </Button>
                    </div>
                </Collapse>
            </div>
        </SidebarLayout>
    );
};

export default FilterSidebar;
