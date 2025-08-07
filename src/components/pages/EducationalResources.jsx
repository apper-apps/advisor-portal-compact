import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { educationalResourceService } from '@/services/api/educationalResourceService';

function EducationalResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Tax Strategies',
    'Asset Protection', 
    'Real Estate',
    'Business Entities'
  ];

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await educationalResourceService.getAll();
      setResources(data);
      toast.success('Educational resources loaded successfully');
    } catch (err) {
      setError('Failed to load educational resources');
      toast.error('Failed to load educational resources');
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleResourceClick = (resource) => {
    toast.info(`Opening ${resource.title}`);
    // In a real app, this would navigate to the resource or open in new tab
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article': return 'FileText';
      case 'video': return 'Play';
      case 'guide': return 'BookOpen';
      default: return 'FileText';
    }
  };

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadResources} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-700 to-navy-800 -m-6 lg:-m-8 p-6 lg:p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <ApperIcon name="GraduationCap" size={28} />
          <h1 className="text-2xl lg:text-3xl font-bold">Educational Resources</h1>
        </div>
        <p className="text-navy-100 text-lg">
          Master the Trifecta System with comprehensive guides, articles, and videos
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <Input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <Empty 
          icon="BookOpen"
          title="No resources found"
          description="Try adjusting your search terms or filters"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <Card 
              key={resource.Id} 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleResourceClick(resource)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-navy-50 rounded-lg">
                      <ApperIcon 
                        name={getTypeIcon(resource.type)} 
                        size={20} 
                        className="text-navy-600" 
                      />
                    </div>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {resource.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={getDifficultyVariant(resource.difficulty)}>
                    {resource.difficulty}
                  </Badge>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                    {resource.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{resource.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Clock" size={16} />
                    <span>{resource.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Calendar" size={16} />
                    <span>{new Date(resource.publishDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResourceClick(resource);
                  }}
                >
                  <ApperIcon name="ExternalLink" size={16} />
                  View Resource
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.slice(1).map((category) => {
          const count = resources.filter(r => r.category === category).length;
          return (
            <Card key={category} className="p-4 text-center">
              <div className="text-2xl font-bold text-navy-700 mb-1">
                {count}
              </div>
              <div className="text-sm text-gray-600">
                {category} Resources
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default EducationalResources;