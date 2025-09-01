import React, { useState, useEffect } from 'react';

const AdminStatusDonutChart = ({ dashboardStats }) => {
    // Calculate statistics - treating each metric as a "status" like the original
    const adminData = [
        { status: 'Total Users', count: dashboardStats.totalUsers || 0 },
        { status: 'Active Users', count: dashboardStats.activeUsers || 0 },
        { status: 'Total Books', count: dashboardStats.totalBooks || 0 },
        { status: 'Open Reports', count: dashboardStats.openReports || 0 }
    ];

    const totalItems = adminData.reduce((sum, item) => sum + item.count, 0);
    
    const statusColors = {
        'Total Users': 'text-blue-400',
        'Active Users': 'text-emerald-300',
        'Total Books': 'text-purple-500',
        'Open Reports': 'text-red-600'
    };
    
    const statusBgColors = {
        'Total Users': 'bg-blue-600',
        'Active Users': 'bg-emerald-500',
        'Total Books': 'bg-purple-600',
        'Open Reports': 'bg-red-500'
    };

    const segments = adminData
        .map(({ status, count }) => ({
            status,
            count,
            percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0,
            color: statusColors[status],
            bgColor: statusBgColors[status]
        }))
        .filter(segment => segment.count > 0) // Only show segments with values
        .sort((a, b) => b.percentage - a.percentage);

    // Animation state - exactly like the original
    const [animatedPercentages, setAnimatedPercentages] = useState(
        segments.reduce((acc, seg) => ({ ...acc, [seg.status]: 0 }), {})
    );

    useEffect(() => {
        // Animate the percentages on mount - same animation as original
        const animationDuration = 1500;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);

            const newPercentages = {};
            segments.forEach(seg => {
                newPercentages[seg.status] = Math.floor(progress * seg.percentage);
            });

            setAnimatedPercentages(newPercentages);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [dashboardStats]);

    return (
        <div className="flex flex-col items-center space-y-8 p-6">
            {/* Donut Chart with Animated Segments - same structure as original */}
            <div className="relative w-64 h-64">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="10"
                    />

                    {/* Segments - exactly like original */}
                    {(() => {
                        let cumulativePercent = 0;
                        return segments.map((segment, i) => {
                            const segmentPercent = animatedPercentages[segment.status] || 0;
                            const dashArray = `${segmentPercent} ${100 - segmentPercent}`;
                            const dashOffset = 100 - cumulativePercent;
                            cumulativePercent += segmentPercent;

                            return (
                                <circle
                                    key={`${segment.status}-${i}`}
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="currentColor"
                                    className={segment.color}
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={dashArray}
                                    strokeDashoffset={dashOffset}
                                    transform="rotate(-90 50 50)"
                                />
                            );
                        });
                    })()}
                </svg>

                {/* Center text with counter animation - same as original */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                        {totalItems}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                        Total Items
                    </span>
                </div>
            </div>

            {/* Enhanced Legend - exactly like original structure */}
            <div className="w-full space-y-4">
                {segments.map((segment, i) => (
                    <div key={`legend-${segment.status}-${i}`} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${segment.bgColor}`} />
                            <span className="text-sm font-medium text-gray-700">
                                {segment.status}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-900">
                                {segment.count}
                            </span>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                {animatedPercentages[segment.status] || 0}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
       
}

export default AdminStatusDonutChart;