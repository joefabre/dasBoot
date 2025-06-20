// Comprehensive Chore Management System
class ChoreManager {
    constructor() {
        this.currentTab = 'daily';
        this.currentDay = this.getCurrentDay();
        this.currentRoom = 'all';
        this.currentSeason = this.getCurrentSeason();
        this.currentCategory = 'all';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTasks();
        this.updateStats();
        this.setActiveDay();
        this.setActiveSeason();
        this.updateDateTime();
        this.startDateTimeUpdater();
    }

    // Comprehensive task database organized by frequency and room
    getTaskDatabase() {
        return {
            daily: {
                monday: [
                    {
                        id: 'mon_1',
                        title: 'Make Beds',
                        room: 'bedroom1',
                        description: 'Make master bedroom bed, fluff pillows, organize nightstand',
                        time: '5 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Start your day with this accomplishment. Use hospital corners for a crisp look.'
                    },
                    {
                        id: 'mon_2',
                        title: 'Kitchen Counter Wipe Down',
                        room: 'kitchen',
                        description: 'Clean counters, stove top, and sink area after breakfast',
                        time: '10 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Use disinfectant spray. Don\'t forget behind the coffee maker and toaster.'
                    },
                    {
                        id: 'mon_3',
                        title: 'Load Dishwasher',
                        room: 'kitchen',
                        description: 'Load breakfast dishes, check if full enough to run',
                        time: '5 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Pre-rinse heavily soiled items. Face soiled surfaces toward center.'
                    },
                    {
                        id: 'mon_4',
                        title: 'Living Room Tidy',
                        room: 'living',
                        description: 'Put items back in place, fluff couch cushions',
                        time: '10 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Do this while coffee brews. Everything should have a designated home.'
                    },
                    {
                        id: 'mon_5',
                        title: 'Check Mail & Sort',
                        room: 'utility',
                        description: 'Collect mail, sort into keep/recycle/shred piles',
                        time: '5 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Immediately toss junk mail. Set up bill payment reminders.'
                    }
                ],
                tuesday: [
                    {
                        id: 'tue_1',
                        title: 'Bathroom Quick Clean',
                        room: 'bathroom',
                        description: 'Wipe sink, counter, toilet seat. Quick mirror clean',
                        time: '8 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Keep cleaning wipes handy. Do this after morning routine.'
                    },
                    {
                        id: 'tue_2',
                        title: 'Kitchen Floor Sweep',
                        room: 'kitchen',
                        description: 'Sweep kitchen floor, spot mop if needed',
                        time: '8 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Check under appliances. Use microfiber slippers for daily maintenance.'
                    },
                    {
                        id: 'tue_3',
                        title: 'Bedroom Dust & Vacuum',
                        room: 'bedroom1',
                        description: 'Light dusting of surfaces, vacuum bedroom floor',
                        time: '15 min',
                        difficulty: 'medium',
                        frequency: 'Daily',
                        tips: 'Move small items before vacuuming. Don\'t forget under the bed monthly.'
                    },
                    {
                        id: 'tue_4',
                        title: 'Laundry Check',
                        room: 'utility',
                        description: 'Check hamper, start load if needed',
                        time: '5 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Sort as you go during the week. Check pockets before washing.'
                    }
                ],
                wednesday: [
                    {
                        id: 'wed_1',
                        title: 'Guest Bedroom Maintenance',
                        room: 'bedroom2',
                        description: 'Dust surfaces, check bed linens, light vacuum if needed',
                        time: '12 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Keep this room guest-ready. Rotate air occasionally.'
                    },
                    {
                        id: 'wed_2',
                        title: 'Kitchen Deep Clean',
                        room: 'kitchen',
                        description: 'Clean appliance surfaces, organize pantry items, wipe cabinets',
                        time: '20 min',
                        difficulty: 'medium',
                        frequency: 'Daily',
                        tips: 'Check expiration dates while organizing. Clean microwave inside.'
                    },
                    {
                        id: 'wed_3',
                        title: 'Living Room Vacuum',
                        room: 'living',
                        description: 'Vacuum carpet/rugs, vacuum under couch cushions',
                        time: '12 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Lift light furniture to vacuum underneath. Empty vacuum if full.'
                    },
                    {
                        id: 'wed_4',
                        title: 'Utility Room Organization',
                        room: 'utility',
                        description: 'Organize cleaning supplies, check inventory',
                        time: '10 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Keep inventory list on phone. Group similar items together.'
                    }
                ],
                thursday: [
                    {
                        id: 'thu_1',
                        title: 'Bathroom Deep Clean',
                        room: 'bathroom',
                        description: 'Clean toilet thoroughly, scrub tub/shower, mop floor',
                        time: '25 min',
                        difficulty: 'medium',
                        frequency: 'Daily',
                        tips: 'Use toilet bowl cleaner first, let sit while cleaning other areas.'
                    },
                    {
                        id: 'thu_2',
                        title: 'Kitchen Appliance Check',
                        room: 'kitchen',
                        description: 'Run dishwasher if full, clean coffee maker, wipe fridge exterior',
                        time: '15 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Use appropriate cleaners for stainless steel. Check dishwasher filter.'
                    },
                    {
                        id: 'thu_3',
                        title: 'Trash & Recycling',
                        room: 'kitchen',
                        description: 'Empty all trash cans, take out recycling, replace bags',
                        time: '10 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Check collection schedule. Clean cans monthly with disinfectant.'
                    },
                    {
                        id: 'thu_4',
                        title: 'Entryway Clean',
                        room: 'utility',
                        description: 'Organize shoes, wipe down surfaces, sweep entry',
                        time: '8 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'This is guests\' first impression. Keep seasonal items rotated.'
                    }
                ],
                friday: [
                    {
                        id: 'fri_1',
                        title: 'Whole Condo Vacuum',
                        room: 'living',
                        description: 'Comprehensive vacuuming of all carpeted areas',
                        time: '30 min',
                        difficulty: 'medium',
                        frequency: 'Daily',
                        tips: 'Move furniture quarterly for deep clean. Check vacuum belts/filters.'
                    },
                    {
                        id: 'fri_2',
                        title: 'Kitchen Mop',
                        room: 'kitchen',
                        description: 'Mop kitchen floor thoroughly, clean baseboards if needed',
                        time: '15 min',
                        difficulty: 'medium',
                        frequency: 'Daily',
                        tips: 'Sweep first. Use hot water for better cleaning. Air dry.'
                    },
                    {
                        id: 'fri_3',
                        title: 'Laundry Finish',
                        room: 'utility',
                        description: 'Fold and put away clean laundry, organize linen closet',
                        time: '20 min',
                        difficulty: 'medium',
                        frequency: 'Daily',
                        tips: 'Fold immediately to prevent wrinkles. Use dividers for organization.'
                    },
                    {
                        id: 'fri_4',
                        title: 'Weekend Prep',
                        room: 'kitchen',
                        description: 'Plan weekend meals, check grocery list, prep what you can',
                        time: '15 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Prep vegetables ahead. Check what needs to be used first.'
                    }
                ],
                saturday: [
                    {
                        id: 'sat_1',
                        title: 'Bathroom Supply Check',
                        room: 'bathroom',
                        description: 'Restock toilet paper, towels, check cleaning supplies',
                        time: '5 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Keep backup supplies in storage. Replace towels weekly.'
                    },
                    {
                        id: 'sat_2',
                        title: 'Garage Storage Check',
                        room: 'garage',
                        description: 'Quick organization check, ensure clear pathways',
                        time: '10 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'Storage room is currently empty - perfect for organization systems!'
                    },
                    {
                        id: 'sat_3',
                        title: 'Living Room Deep Clean',
                        room: 'living',
                        description: 'Dust all surfaces, clean glass, organize entertainment center',
                        time: '25 min',
                        difficulty: 'medium',
                        frequency: 'Daily',
                        tips: 'Use microfiber for electronics. Don\'t forget ceiling fans monthly.'
                    },
                    {
                        id: 'sat_4',
                        title: 'Kitchen Organization',
                        room: 'kitchen',
                        description: 'Organize cabinets, check pantry, plan next week\'s meals',
                        time: '20 min',
                        difficulty: 'medium',
                        frequency: 'Daily',
                        tips: 'FIFO - First In, First Out for food items. Update shopping list.'
                    }
                ],
                sunday: [
                    {
                        id: 'sun_1',
                        title: 'Rest Day ☯️',
                        room: 'living',
                        description: 'No chores today! Enjoy your well-maintained home.',
                        time: '0 min',
                        difficulty: 'easy',
                        frequency: 'Daily',
                        tips: 'You\'ve earned this rest! Maybe just keep things tidy as you go.'
                    }
                ]
            },
            weekly: {
                bedroom1: [
                    {
                        id: 'w_br1_1',
                        title: 'Change Bed Sheets',
                        description: 'Strip bed, wash sheets, make bed with fresh linens',
                        time: '20 min',
                        difficulty: 'easy',
                        frequency: 'Weekly',
                        tips: 'Wash in hot water. Have 2-3 sets for rotation.'
                    },
                    {
                        id: 'w_br1_2',
                        title: 'Dust All Surfaces',
                        description: 'Nightstands, dresser, windowsills, baseboards',
                        time: '15 min',
                        difficulty: 'easy',
                        frequency: 'Weekly',
                        tips: 'Top to bottom. Use microfiber cloth slightly damp.'
                    },
                    {
                        id: 'w_br1_3',
                        title: 'Closet Organization',
                        description: 'Organize clothes, check for items to donate',
                        time: '25 min',
                        difficulty: 'medium',
                        frequency: 'Weekly',
                        tips: 'One in, one out rule. Organize by color or season.'
                    }
                ],
                bedroom2: [
                    {
                        id: 'w_br2_1',
                        title: 'Air Out Room',
                        description: 'Open windows, change air freshener if needed',
                        time: '5 min',
                        difficulty: 'easy',
                        frequency: 'Weekly',
                        tips: 'Keep room guest-ready. Rotate air for freshness.'
                    },
                    {
                        id: 'w_br2_2',
                        title: 'Dust & Light Vacuum',
                        description: 'Dust surfaces, light vacuum if room has been used',
                        time: '15 min',
                        difficulty: 'easy',
                        frequency: 'Weekly',
                        tips: 'Less intensive than master bedroom since used less.'
                    }
                ],
                bathroom: [
                    {
                        id: 'w_bath_1',
                        title: 'Deep Clean Shower/Tub',
                        description: 'Scrub walls, clean grout, deep clean fixtures',
                        time: '30 min',
                        difficulty: 'hard',
                        frequency: 'Weekly',
                        tips: 'Use grout brush. Clean after hot shower when surfaces are warm.'
                    },
                    {
                        id: 'w_bath_2',
                        title: 'Clean Mirror & Light Fixtures',
                        description: 'Clean bathroom mirror, wipe light fixtures and switch plates',
                        time: '10 min',
                        difficulty: 'easy',
                        frequency: 'Weekly',
                        tips: 'Use newspaper for streak-free mirrors. Don\'t forget behind toilet.'
                    },
                    {
                        id: 'w_bath_3',
                        title: 'Organize Medicine Cabinet',
                        description: 'Check expiration dates, organize toiletries',
                        time: '15 min',
                        difficulty: 'easy',
                        frequency: 'Weekly',
                        tips: 'Dispose of expired medications safely. Group similar items.'
                    }
                ],
                kitchen: [
                    {
                        id: 'w_kit_1',
                        title: 'Clean Inside Appliances',
                        description: 'Clean microwave, oven interior, coffee maker descaling',
                        time: '45 min',
                        difficulty: 'medium',
                        frequency: 'Weekly',
                        tips: 'Use baking soda paste for tough stains. Steam clean microwave with water and lemon.'
                    },
                    {
                        id: 'w_kit_2',
                        title: 'Deep Clean Sink & Faucet',
                        description: 'Scrub sink, polish faucet, clean disposal',
                        time: '20 min',
                        difficulty: 'medium',
                        frequency: 'Weekly',
                        tips: 'Use ice and salt to clean disposal. Lemon peels for freshness.'
                    },
                    {
                        id: 'w_kit_3',
                        title: 'Organize Pantry',
                        description: 'Check expiration dates, organize by category',
                        time: '30 min',
                        difficulty: 'medium',
                        frequency: 'Weekly',
                        tips: 'Front face products. Use clear containers for bulk items.'
                    },
                    {
                        id: 'w_kit_4',
                        title: 'Clean Refrigerator',
                        description: 'Wipe shelves, check leftovers, clean exterior',
                        time: '25 min',
                        difficulty: 'medium',
                        frequency: 'Weekly',
                        tips: 'Clean spills immediately. Use baking soda box for odors.'
                    }
                ],
                living: [
                    {
                        id: 'w_liv_1',
                        title: 'Dust Electronics',
                        description: 'TV, speakers, gaming systems, remotes',
                        time: '15 min',
                        difficulty: 'easy',
                        frequency: 'Weekly',
                        tips: 'Use anti-static cloth. Don\'t forget cords and back panels.'
                    },
                    {
                        id: 'w_liv_2',
                        title: 'Deep Vacuum Furniture',
                        description: 'Remove cushions, vacuum thoroughly, clean under sofa',
                        time: '20 min',
                        difficulty: 'medium',
                        frequency: 'Weekly',
                        tips: 'Check for lost items. Flip cushions for even wear.'
                    },
                    {
                        id: 'w_liv_3',
                        title: 'Clean Windows',
                        description: 'Wash windows inside and out if accessible',
                        time: '25 min',
                        difficulty: 'medium',
                        frequency: 'Weekly',
                        tips: 'Clean on cloudy day to prevent streaking. Squeegee works best.'
                    }
                ],
                utility: [
                    {
                        id: 'w_util_1',
                        title: 'Deep Clean Laundry Area',
                        description: 'Clean washer/dryer, organize supplies, mop floor',
                        time: '30 min',
                        difficulty: 'medium',
                        frequency: 'Weekly',
                        tips: 'Clean lint trap thoroughly. Wipe down machine exteriors.'
                    },
                    {
                        id: 'w_util_2',
                        title: 'Organize Entry Way',
                        description: 'Organize shoes, clean coat closet, dust surfaces',
                        time: '20 min',
                        difficulty: 'easy',
                        frequency: 'Weekly',
                        tips: 'Keep only current season items accessible. Use shoe organizers.'
                    }
                ],
                garage: [
                    {
                        id: 'w_gar_1',
                        title: 'Storage Room Setup',
                        description: 'Plan storage solutions for empty storage room',
                        time: '15 min',
                        difficulty: 'easy',
                        frequency: 'Weekly',
                        tips: 'Consider shelving systems. Group seasonal items together.'
                    },
                    {
                        id: 'w_gar_2',
                        title: 'Garage Maintenance',
                        description: 'Sweep garage floor, check for issues, organize tools if any',
                        time: '15 min',
                        difficulty: 'easy',
                        frequency: 'Weekly',
                        tips: 'Keep emergency supplies accessible. Check smoke detector.'
                    }
                ]
            },
            monthly: [
                {
                    id: 'm_1',
                    title: 'Deep Clean Baseboards',
                    room: 'all',
                    description: 'Wipe down all baseboards throughout condo',
                    time: '60 min',
                    difficulty: 'medium',
                    frequency: 'Monthly',
                    tips: 'Use dryer sheets to repel dust. Work systematically room by room.'
                },
                {
                    id: 'm_2',
                    title: 'Clean Light Fixtures',
                    room: 'all',
                    description: 'Dust and clean all light fixtures, replace bulbs as needed',
                    time: '45 min',
                    difficulty: 'medium',
                    frequency: 'Monthly',
                    tips: 'Turn off breakers for safety. Use microfiber cloth for delicate fixtures.'
                },
                {
                    id: 'm_3',
                    title: 'Vacuum Under Furniture',
                    room: 'living',
                    description: 'Move furniture and vacuum underneath thoroughly',
                    time: '40 min',
                    difficulty: 'hard',
                    frequency: 'Monthly',
                    tips: 'Get help moving heavy items. Use furniture sliders to protect floors.'
                },
                {
                    id: 'm_4',
                    title: 'Clean Ceiling Fans',
                    room: 'bedroom1',
                    description: 'Dust and clean all ceiling fans',
                    time: '20 min',
                    difficulty: 'medium',
                    frequency: 'Monthly',
                    tips: 'Use pillowcase method to catch dust. Clean when fans are off.'
                },
                {
                    id: 'm_5',
                    title: 'Organize Storage Areas',
                    room: 'garage',
                    description: 'Set up and organize storage room, plan seasonal rotations',
                    time: '90 min',
                    difficulty: 'medium',
                    frequency: 'Monthly',
                    tips: 'Label everything clearly. Use clear bins for visibility.'
                },
                {
                    id: 'm_6',
                    title: 'Deep Clean Oven',
                    room: 'kitchen',
                    description: 'Use oven cleaner, clean racks, check oven seals',
                    time: '50 min',
                    difficulty: 'hard',
                    frequency: 'Monthly',
                    tips: 'Remove racks first. Use baking soda paste for natural cleaning.'
                },
                {
                    id: 'm_7',
                    title: 'Washing Machine Deep Clean',
                    room: 'utility',
                    description: 'Run cleaning cycle, clean rubber seals, wipe exterior',
                    time: '20 min',
                    difficulty: 'easy',
                    frequency: 'Monthly',
                    tips: 'Leave door open after use to air dry. Use washing machine cleaner.'
                },
                {
                    id: 'm_8',
                    title: 'Bathroom Grout Deep Clean',
                    room: 'bathroom',
                    description: 'Deep clean grout lines, re-caulk if necessary',
                    time: '45 min',
                    difficulty: 'hard',
                    frequency: 'Monthly',
                    tips: 'Use old toothbrush for grout lines. Ventilate well when using bleach.'
                }
            ],
            seasonal: {
                spring: [
                    {
                        id: 's_spr_1',
                        title: 'Spring Deep Clean',
                        room: 'all',
                        description: 'Comprehensive deep cleaning of entire condo',
                        time: '4 hours',
                        difficulty: 'hard',
                        tips: 'Break into multiple sessions. Open windows for fresh air.'
                    },
                    {
                        id: 's_spr_2',
                        title: 'Wardrobe Seasonal Switch',
                        room: 'bedroom1',
                        description: 'Switch winter/summer clothes, donate unused items',
                        time: '2 hours',
                        difficulty: 'medium',
                        tips: 'Try everything on. If not worn in a year, donate.'
                    },
                    {
                        id: 's_spr_3',
                        title: 'AC System Check',
                        room: 'all',
                        description: 'Replace filters, test AC, clean vents',
                        time: '30 min',
                        difficulty: 'easy',
                        tips: 'Schedule professional service if needed. Check thermostat batteries.'
                    },
                    {
                        id: 's_spr_4',
                        title: 'Organize Storage Room',
                        room: 'garage',
                        description: 'Set up seasonal storage system in empty storage room',
                        time: '3 hours',
                        difficulty: 'medium',
                        tips: 'Perfect time to install shelving! Plan for holiday decorations.'
                    }
                ],
                summer: [
                    {
                        id: 's_sum_1',
                        title: 'AC Maintenance',
                        room: 'all',
                        description: 'Deep clean AC units, replace filters, check efficiency',
                        time: '45 min',
                        difficulty: 'medium',
                        tips: 'Clean or replace filters monthly in heavy use season.'
                    },
                    {
                        id: 's_sum_2',
                        title: 'Deep Clean Fans',
                        room: 'all',
                        description: 'Thoroughly clean all ceiling and portable fans',
                        time: '60 min',
                        difficulty: 'medium',
                        tips: 'Fans work harder in summer. Clean blades weekly during peak season.'
                    },
                    {
                        id: 's_sum_3',
                        title: 'Refrigerator Deep Clean',
                        room: 'kitchen',
                        description: 'Complete refrigerator cleaning, coils, seals, interior',
                        time: '90 min',
                        difficulty: 'medium',
                        tips: 'Clean coils for efficiency. Check seals for proper closure.'
                    },
                    {
                        id: 's_sum_4',
                        title: 'Summer Storage Setup',
                        room: 'garage',
                        description: 'Store winter items, organize summer equipment',
                        time: '2 hours',
                        difficulty: 'medium',
                        tips: 'Use moisture absorbers. Label seasonal boxes clearly.'
                    }
                ],
                fall: [
                    {
                        id: 's_fall_1',
                        title: 'Heating System Check',
                        room: 'all',
                        description: 'Test heating, replace filters, check vents',
                        time: '45 min',
                        difficulty: 'medium',
                        tips: 'Schedule professional service. Test before you need it.'
                    },
                    {
                        id: 's_fall_2',
                        title: 'Wardrobe Switch',
                        room: 'bedroom1',
                        description: 'Switch to fall/winter wardrobe, store summer clothes',
                        time: '2 hours',
                        difficulty: 'medium',
                        tips: 'Clean clothes before storing. Use cedar blocks for moths.'
                    },
                    {
                        id: 's_fall_3',
                        title: 'Deep Clean Before Holidays',
                        room: 'all',
                        description: 'Thorough cleaning in preparation for holiday season',
                        time: '5 hours',
                        difficulty: 'hard',
                        tips: 'Spread over weekend. Focus on guest areas first.'
                    },
                    {
                        id: 's_fall_4',
                        title: 'Holiday Decoration Prep',
                        room: 'garage',
                        description: 'Organize holiday decorations in storage room',
                        time: '1 hour',
                        difficulty: 'easy',
                        tips: 'Perfect use for storage room! Keep decorations accessible.'
                    }
                ],
                winter: [
                    {
                        id: 's_win_1',
                        title: 'Heating Efficiency Check',
                        room: 'all',
                        description: 'Check for drafts, seal gaps, optimize heating',
                        time: '60 min',
                        difficulty: 'medium',
                        tips: 'Use weather stripping. Check windows and doors for drafts.'
                    },
                    {
                        id: 's_win_2',
                        title: 'Humidity Control',
                        room: 'all',
                        description: 'Set up humidifiers, monitor air quality',
                        time: '30 min',
                        difficulty: 'easy',
                        tips: 'Maintain 30-50% humidity. Clean humidifiers regularly.'
                    },
                    {
                        id: 's_win_3',
                        title: 'Deep Clean & Organize',
                        room: 'all',
                        description: 'Winter deep clean, organize for new year',
                        time: '4 hours',
                        difficulty: 'hard',
                        tips: 'Great time for decluttering. Prepare for spring cleaning.'
                    },
                    {
                        id: 's_win_4',
                        title: 'Storage Room Winter Setup',
                        room: 'garage',
                        description: 'Organize winter gear, protect from moisture',
                        time: '90 min',
                        difficulty: 'medium',
                        tips: 'Keep snow gear accessible. Use moisture control in storage.'
                    }
                ]
            },
            maintenance: {
                hvac: [
                    {
                        id: 'm_hvac_1',
                        title: 'Change HVAC Filters',
                        category: 'hvac',
                        description: 'Replace air filters in HVAC system',
                        frequency: 'Every 3 months',
                        time: '15 min',
                        difficulty: 'easy',
                        tips: 'Mark calendar for regular changes. Buy filters in bulk.'
                    },
                    {
                        id: 'm_hvac_2',
                        title: 'Clean Air Vents',
                        category: 'hvac',
                        description: 'Remove and clean all air vent covers',
                        frequency: 'Every 6 months',
                        time: '45 min',
                        difficulty: 'medium',
                        tips: 'Use vacuum with brush attachment first, then wash with soapy water.'
                    },
                    {
                        id: 'm_hvac_3',
                        title: 'Professional HVAC Service',
                        category: 'hvac',
                        description: 'Schedule professional HVAC inspection and service',
                        frequency: 'Annually',
                        time: '2 hours',
                        difficulty: 'easy',
                        tips: 'Schedule in spring and fall. Keep service records.'
                    }
                ],
                plumbing: [
                    {
                        id: 'm_plumb_1',
                        title: 'Check for Leaks',
                        category: 'plumbing',
                        description: 'Inspect all faucets, pipes, and connections for leaks',
                        frequency: 'Monthly',
                        time: '20 min',
                        difficulty: 'easy',
                        tips: 'Check under sinks and around toilet base. Look for water stains.'
                    },
                    {
                        id: 'm_plumb_2',
                        title: 'Test Water Pressure',
                        category: 'plumbing',
                        description: 'Check water pressure in all fixtures',
                        frequency: 'Every 6 months',
                        time: '15 min',
                        difficulty: 'easy',
                        tips: 'Low pressure might indicate clogs or system issues.'
                    },
                    {
                        id: 'm_plumb_3',
                        title: 'Clean Drains',
                        category: 'plumbing',
                        description: 'Use drain cleaner or snake to clear slow drains',
                        frequency: 'Every 3 months',
                        time: '30 min',
                        difficulty: 'medium',
                        tips: 'Use enzyme cleaners monthly for prevention. Avoid chemical cleaners.'
                    },
                    {
                        id: 'm_plumb_4',
                        title: 'Water Heater Check',
                        category: 'plumbing',
                        description: 'Check water heater for leaks, test temperature',
                        frequency: 'Every 6 months',
                        time: '15 min',
                        difficulty: 'medium',
                        tips: 'Listen for unusual noises. Check temperature relief valve.'
                    }
                ],
                electrical: [
                    {
                        id: 'm_elec_1',
                        title: 'Test GFCI Outlets',
                        category: 'electrical',
                        description: 'Test all GFCI outlets in bathroom and kitchen',
                        frequency: 'Monthly',
                        time: '10 min',
                        difficulty: 'easy',
                        tips: 'Press test button, then reset. If it doesn\'t work, call electrician.'
                    },
                    {
                        id: 'm_elec_2',
                        title: 'Check Smoke Detector Batteries',
                        category: 'electrical',
                        description: 'Test smoke detectors and replace batteries',
                        frequency: 'Every 6 months',
                        time: '15 min',
                        difficulty: 'easy',
                        tips: 'Change batteries when daylight saving time changes.'
                    },
                    {
                        id: 'm_elec_3',
                        title: 'Inspect Electrical Cords',
                        category: 'electrical',
                        description: 'Check all electrical cords for damage',
                        frequency: 'Every 3 months',
                        time: '20 min',
                        difficulty: 'easy',
                        tips: 'Look for fraying, cracks, or exposed wires. Replace immediately if damaged.'
                    }
                ],
                appliances: [
                    {
                        id: 'm_app_1',
                        title: 'Clean Refrigerator Coils',
                        category: 'appliances',
                        description: 'Vacuum refrigerator coils for efficiency',
                        frequency: 'Every 6 months',
                        time: '20 min',
                        difficulty: 'medium',
                        tips: 'Unplug first. Coils may be on back or underneath.'
                    },
                    {
                        id: 'm_app_2',
                        title: 'Dishwasher Deep Clean',
                        category: 'appliances',
                        description: 'Clean dishwasher filter and run cleaning cycle',
                        frequency: 'Monthly',
                        time: '30 min',
                        difficulty: 'easy',
                        tips: 'Remove and rinse filter. Use dishwasher cleaner or white vinegar.'
                    },
                    {
                        id: 'm_app_3',
                        title: 'Dryer Vent Cleaning',
                        category: 'appliances',
                        description: 'Clean dryer vent from inside and outside',
                        frequency: 'Every 6 months',
                        time: '45 min',
                        difficulty: 'medium',
                        tips: 'Use dryer vent brush. Clear lint from outdoor vent too.'
                    },
                    {
                        id: 'm_app_4',
                        title: 'Washing Machine Maintenance',
                        category: 'appliances',
                        description: 'Run cleaning cycle, clean rubber seals',
                        frequency: 'Monthly',
                        time: '15 min',
                        difficulty: 'easy',
                        tips: 'Leave door open after use. Use washing machine cleaner.'
                    }
                ],
                safety: [
                    {
                        id: 'm_safe_1',
                        title: 'Test Smoke Detectors',
                        category: 'safety',
                        description: 'Test all smoke detectors and carbon monoxide detectors',
                        frequency: 'Monthly',
                        time: '10 min',
                        difficulty: 'easy',
                        tips: 'Press test button on each unit. Replace batteries annually.'
                    },
                    {
                        id: 'm_safe_2',
                        title: 'Check Fire Extinguisher',
                        category: 'safety',
                        description: 'Inspect fire extinguisher pressure and expiration',
                        frequency: 'Every 6 months',
                        time: '5 min',
                        difficulty: 'easy',
                        tips: 'Keep in kitchen. Check pressure gauge in green zone.'
                    },
                    {
                        id: 'm_safe_3',
                        title: 'Emergency Kit Check',
                        category: 'safety',
                        description: 'Check emergency supplies, update as needed',
                        frequency: 'Every 6 months',
                        time: '30 min',
                        difficulty: 'easy',
                        tips: 'Store in garage storage room. Include water, food, flashlight, radio.'
                    },
                    {
                        id: 'm_safe_4',
                        title: 'Security System Test',
                        category: 'safety',
                        description: 'Test security system, door/window locks',
                        frequency: 'Monthly',
                        time: '15 min',
                        difficulty: 'easy',
                        tips: 'Test all entry points. Update emergency contact info.'
                    }
                ]
            }
        };
    }

    getCurrentDay() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[new Date().getDay()];
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'fall';
        return 'winter';
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Day selection
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectDay(e.target.dataset.day);
            });
        });

        // Room filtering
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByRoom(e.target.dataset.room);
            });
        });

        // Season selection
        document.querySelectorAll('.season-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectSeason(e.target.dataset.season);
            });
        });

        // Category selection
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectCategory(e.target.dataset.category);
            });
        });

        // Modal events
        const modal = document.getElementById('taskModal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Modal action buttons
        document.getElementById('markCompleteBtn').addEventListener('click', () => {
            this.markTaskComplete();
        });

        document.getElementById('skipTaskBtn').addEventListener('click', () => {
            this.skipTask();
        });

        document.getElementById('snoozeTaskBtn').addEventListener('click', () => {
            this.snoozeTask();
        });
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
        this.loadTasks();
    }

    selectDay(day) {
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-day="${day}"]`).classList.add('active');

        this.currentDay = day;
        this.loadDailyTasks();
    }

    filterByRoom(room) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-room="${room}"]`).classList.add('active');

        this.currentRoom = room;
        if (this.currentTab === 'daily') {
            this.loadDailyTasks();
        } else if (this.currentTab === 'weekly') {
            this.loadWeeklyTasks();
        }
    }

    selectSeason(season) {
        document.querySelectorAll('.season-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-season="${season}"]`).classList.add('active');

        this.currentSeason = season;
        this.loadSeasonalTasks();
    }

    selectCategory(category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        this.currentCategory = category;
        this.loadMaintenanceTasks();
    }

    setActiveDay() {
        const todayBtn = document.querySelector(`[data-day="${this.currentDay}"]`);
        if (todayBtn) {
            todayBtn.classList.add('active');
        }
    }

    setActiveSeason() {
        const seasonBtn = document.querySelector(`[data-season="${this.currentSeason}"]`);
        if (seasonBtn) {
            seasonBtn.classList.add('active');
        }
    }

    loadTasks() {
        switch(this.currentTab) {
            case 'daily':
                this.loadDailyTasks();
                break;
            case 'weekly':
                this.loadWeeklyTasks();
                break;
            case 'monthly':
                this.loadMonthlyTasks();
                break;
            case 'seasonal':
                this.loadSeasonalTasks();
                break;
            case 'maintenance':
                this.loadMaintenanceTasks();
                break;
        }
    }

    loadDailyTasks() {
        const container = document.getElementById('dailyTasks');
        const taskDB = this.getTaskDatabase().daily;
        let tasks = taskDB[this.currentDay] || [];
        
        if (this.currentDay === 'sunday') {
            container.innerHTML = `
                <div class="task-card">
                    <div style="text-align: center; padding: 20px;">
                        <h2 style="color: #28a745; margin-bottom: 15px;">🌟 Sunday Rest Day 🌟</h2>
                        <p style="font-size: 1.1rem; color: #666; margin-bottom: 15px;">
                            Take a well-deserved break! Your home is well-maintained thanks to your consistent efforts throughout the week.
                        </p>
                        <p style="color: #888;">
                            Feel free to just keep things tidy as you go, but no formal chores today! 
                            Enjoy your clean, organized space. ☯️
                        </p>
                    </div>
                </div>
            `;
            return;
        }

        // Filter by room if not "all"
        if (this.currentRoom !== 'all') {
            tasks = tasks.filter(task => task.room === this.currentRoom);
        }

        container.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');
        this.attachTaskEventListeners();
    }

    loadWeeklyTasks() {
        const container = document.getElementById('weeklyTasks');
        const taskDB = this.getTaskDatabase().weekly;
        let tasks = [];

        if (this.currentRoom === 'all') {
            // Show all weekly tasks
            Object.keys(taskDB).forEach(room => {
                tasks = tasks.concat(taskDB[room].map(task => ({...task, room})));
            });
        } else {
            // Show tasks for specific room
            tasks = taskDB[this.currentRoom] || [];
            tasks = tasks.map(task => ({...task, room: this.currentRoom}));
        }

        container.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');
        this.attachTaskEventListeners();
    }

    loadMonthlyTasks() {
        const container = document.getElementById('monthlyTasks');
        const tasks = this.getTaskDatabase().monthly;

        // Create calendar view
        this.createMonthCalendar();
        
        container.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');
        this.attachTaskEventListeners();
    }

    loadSeasonalTasks() {
        const container = document.getElementById('seasonalTasks');
        const tasks = this.getTaskDatabase().seasonal[this.currentSeason] || [];

        container.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');
        this.attachTaskEventListeners();
    }

    loadMaintenanceTasks() {
        const container = document.getElementById('maintenanceTasks');
        const taskDB = this.getTaskDatabase().maintenance;
        let tasks = [];

        if (this.currentCategory === 'all') {
            // Show all maintenance tasks
            Object.keys(taskDB).forEach(category => {
                tasks = tasks.concat(taskDB[category]);
            });
        } else {
            // Show tasks for specific category
            tasks = taskDB[this.currentCategory] || [];
        }

        container.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');
        this.attachTaskEventListeners();
    }

    createTaskCard(task) {
        const isCompleted = this.isTaskCompleted(task.id);
        const priorityClass = task.priority ? `${task.priority}-priority` : '';
        const completedClass = isCompleted ? 'completed' : '';
        const roomDisplay = this.getRoomDisplayName(task.room);
        const frequency = task.frequency || 'Daily';

        return `
            <div class="task-card ${priorityClass} ${completedClass}" data-task-id="${task.id}">
                <div class="task-header">
                    <div class="task-title">${task.title}</div>
                    ${task.room ? `<div class="task-room">${roomDisplay}</div>` : ''}
                </div>
                <div class="task-meta">
                    <span>⏱️ ${task.time}</span>
                    <span class="difficulty-badge difficulty-${task.difficulty}">
                        ${this.getDifficultyIcon(task.difficulty)} ${task.difficulty}
                    </span>
                    <span>📅 ${frequency}</span>
                </div>
                <div class="task-description">${task.description}</div>
                <div class="task-actions">
                    <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''} aria-label="Mark task as ${isCompleted ? 'incomplete' : 'complete'}">
                    <span style="margin-left: 10px; font-size: 0.9rem; color: #666;">
                        ${isCompleted ? '✅ Completed' : 'Click for details'}
                    </span>
                </div>
            </div>
        `;
    }

    getRoomDisplayName(room) {
        const roomNames = {
            'bedroom1': '🛏️ Master BR',
            'bedroom2': '🛏️ Guest BR',
            'bathroom': '🚿 Bathroom',
            'kitchen': '🍳 Kitchen',
            'living': '🛋️ Living Room',
            'utility': '🧺 Utility/Entry',
            'garage': '🚗 Garage',
            'all': '🏠 All Rooms'
        };
        return roomNames[room] || room;
    }

    getDifficultyIcon(difficulty) {
        const icons = {
            'easy': '💚',
            'medium': '💛',
            'hard': '❤️'
        };
        return icons[difficulty] || '💙';
    }

    attachTaskEventListeners() {
        document.querySelectorAll('.task-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('task-checkbox')) {
                    this.showTaskModal(card.dataset.taskId);
                }
            });

            const checkbox = card.querySelector('.task-checkbox');
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.toggleTask(card.dataset.taskId, checkbox.checked);
            });
        });
    }

    showTaskModal(taskId) {
        const task = this.findTaskById(taskId);
        if (!task) return;

        document.getElementById('modalTitle').textContent = task.title;
        document.getElementById('modalDescription').textContent = task.description;
        document.getElementById('modalTime').textContent = `⏱️ Est. Time: ${task.time}`;
        document.getElementById('modalDifficulty').textContent = `💪 Difficulty: ${task.difficulty}`;
        document.getElementById('modalFrequency').textContent = `📅 Frequency: ${task.frequency || 'As scheduled'}`;
        
        const tipsContainer = document.getElementById('modalTips');
        if (task.tips) {
            tipsContainer.innerHTML = `
                <h4 style="margin-bottom: 10px; color: #667eea;">💡 Tips & Tricks:</h4>
                <p>${task.tips}</p>
            `;
            tipsContainer.style.display = 'block';
        } else {
            tipsContainer.style.display = 'none';
        }

        // Store current task for modal actions
        this.currentModalTask = taskId;
        
        document.getElementById('taskModal').style.display = 'block';
    }

    findTaskById(taskId) {
        const taskDB = this.getTaskDatabase();
        
        // Search in daily tasks
        for (let day in taskDB.daily) {
            const task = taskDB.daily[day].find(t => t.id === taskId);
            if (task) return task;
        }
        
        // Search in weekly tasks
        for (let room in taskDB.weekly) {
            const task = taskDB.weekly[room].find(t => t.id === taskId);
            if (task) return task;
        }
        
        // Search in monthly tasks
        const monthlyTask = taskDB.monthly.find(t => t.id === taskId);
        if (monthlyTask) return monthlyTask;
        
        // Search in seasonal tasks
        for (let season in taskDB.seasonal) {
            const task = taskDB.seasonal[season].find(t => t.id === taskId);
            if (task) return task;
        }
        
        // Search in maintenance tasks
        for (let category in taskDB.maintenance) {
            const task = taskDB.maintenance[category].find(t => t.id === taskId);
            if (task) return task;
        }
        
        return null;
    }

    toggleTask(taskId, completed) {
        if (completed) {
            this.markTaskCompleted(taskId);
        } else {
            this.markTaskIncomplete(taskId);
        }
        this.updateStats();
        this.updateTaskCard(taskId, completed);
    }

    markTaskCompleted(taskId) {
        const completedTasks = this.getCompletedTasks();
        const today = new Date().toDateString();
        
        if (!completedTasks[today]) {
            completedTasks[today] = [];
        }
        
        if (!completedTasks[today].includes(taskId)) {
            completedTasks[today].push(taskId);
            this.saveCompletedTasks(completedTasks);
        }
    }

    markTaskIncomplete(taskId) {
        const completedTasks = this.getCompletedTasks();
        const today = new Date().toDateString();
        
        if (completedTasks[today]) {
            completedTasks[today] = completedTasks[today].filter(id => id !== taskId);
            this.saveCompletedTasks(completedTasks);
        }
    }

    isTaskCompleted(taskId) {
        const completedTasks = this.getCompletedTasks();
        const today = new Date().toDateString();
        return completedTasks[today] && completedTasks[today].includes(taskId);
    }

    getCompletedTasks() {
        return JSON.parse(localStorage.getItem('choreCompletedTasks') || '{}');
    }

    saveCompletedTasks(tasks) {
        localStorage.setItem('choreCompletedTasks', JSON.stringify(tasks));
    }

    updateTaskCard(taskId, completed) {
        const card = document.querySelector(`[data-task-id="${taskId}"]`);
        if (card) {
            if (completed) {
                card.classList.add('completed');
            } else {
                card.classList.remove('completed');
            }
        }
    }

    markTaskComplete() {
        if (this.currentModalTask) {
            this.markTaskCompleted(this.currentModalTask);
            this.updateTaskCard(this.currentModalTask, true);
            this.updateStats();
            document.getElementById('taskModal').style.display = 'none';
        }
    }

    skipTask() {
        // Just close modal - implement skip logic if needed
        document.getElementById('taskModal').style.display = 'none';
    }

    snoozeTask() {
        // Implement snooze logic - could set reminder for 1 hour
        alert('Task snoozed for 1 hour! (Feature coming soon)');
        document.getElementById('taskModal').style.display = 'none';
    }

    updateStats() {
        const today = new Date().toDateString();
        const completedTasks = this.getCompletedTasks()[today] || [];
        
        // Update completed today
        document.getElementById('completedToday').textContent = completedTasks.length;
        
        // Calculate weekly progress
        const weeklyProgress = this.calculateWeeklyProgress();
        document.getElementById('weeklyProgress').textContent = `${weeklyProgress}%`;
        
        // Calculate current streak
        const streak = this.calculateStreak();
        document.getElementById('currentStreak').textContent = streak;
    }

    calculateWeeklyProgress() {
        const thisWeek = this.getThisWeeksCompletedTasks();
        const totalWeeklyTasks = this.getTotalWeeklyTasks();
        
        if (totalWeeklyTasks === 0) return 0;
        return Math.round((thisWeek.length / totalWeeklyTasks) * 100);
    }

    getThisWeeksCompletedTasks() {
        const completedTasks = this.getCompletedTasks();
        const thisWeek = [];
        
        // Get dates for this week (Monday to Saturday, excluding Sunday)
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        
        for (let i = 0; i < 6; i++) { // Monday to Saturday
            const date = new Date(today);
            date.setDate(today.getDate() + mondayOffset + i);
            const dateString = date.toDateString();
            
            if (completedTasks[dateString]) {
                thisWeek.push(...completedTasks[dateString]);
            }
        }
        
        return thisWeek;
    }

    getTotalWeeklyTasks() {
        const taskDB = this.getTaskDatabase();
        let total = 0;
        
        // Count daily tasks (Monday to Saturday)
        const workDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        workDays.forEach(day => {
            if (taskDB.daily[day]) {
                total += taskDB.daily[day].length;
            }
        });
        
        return total;
    }

    calculateStreak() {
        const completedTasks = this.getCompletedTasks();
        let streak = 0;
        const today = new Date();
        
        // Check backwards from today (excluding Sundays)
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            
            // Skip Sundays
            if (checkDate.getDay() === 0) continue;
            
            const dateString = checkDate.toDateString();
            
            if (completedTasks[dateString] && completedTasks[dateString].length > 0) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    createMonthCalendar() {
        const container = document.getElementById('monthCalendar');
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        // Create simple calendar view
        container.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <h3 style="text-align: center; margin-bottom: 20px;">
                    ${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <p style="text-align: center; color: #666;">
                    Monthly tasks help maintain your home's long-term condition and efficiency.
                    Spread these tasks throughout the month for best results.
                </p>
            </div>
        `;
    }


    getRoomTasksForToday(room) {
        const taskDB = this.getTaskDatabase();
        const today = this.getCurrentDay();
        
        if (today === 'sunday') return [];
        
        const dailyTasks = taskDB.daily[today] || [];
        return dailyTasks.filter(task => task.room === room);
    }

    // Date and time functions
    updateDateTime() {
        const now = new Date();
        
        // Update date
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateString = now.toLocaleDateString('en-US', dateOptions);
        document.getElementById('dateDisplay').textContent = dateString;
        
        // Update time
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        };
        const timeString = now.toLocaleTimeString('en-US', timeOptions);
        document.getElementById('timeDisplay').textContent = timeString;
    }

    startDateTimeUpdater() {
        // Update every second
        setInterval(() => {
            this.updateDateTime();
        }, 1000);
    }
}

// Data management functions
function exportData() {
    const data = {
        completedTasks: JSON.parse(localStorage.getItem('choreCompletedTasks') || '{}'),
        settings: JSON.parse(localStorage.getItem('choreSettings') || '{}'),
        metadata: {
            exported: new Date().toISOString(),
            version: '1.0.0',
            projectType: 'choreManager'
        }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chore-progress.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ Chore progress exported successfully!');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.completedTasks) {
                    localStorage.setItem('choreCompletedTasks', JSON.stringify(data.completedTasks));
                }
                if (data.settings) {
                    localStorage.setItem('choreSettings', JSON.stringify(data.settings));
                }
                
                alert('✅ Chore progress imported successfully!');
                location.reload();
            } catch (error) {
                alert('❌ Error importing data. Please check file format.');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function resetProgress() {
    if (confirm('⚠️ Are you sure you want to reset all progress? This cannot be undone!')) {
        localStorage.removeItem('choreCompletedTasks');
        localStorage.removeItem('choreSettings');
        alert('🔄 Progress reset successfully!');
        location.reload();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ChoreManager();
});

