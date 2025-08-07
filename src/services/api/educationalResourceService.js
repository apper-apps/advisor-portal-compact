import mockEducationalResources from '@/services/mockData/educationalResources.json';

class EducationalResourceService {
  constructor() {
    this.resources = [...mockEducationalResources];
    this.nextId = Math.max(...this.resources.map(r => r.Id)) + 1;
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.resources];
  }

  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid resource ID');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    const resource = this.resources.find(r => r.Id === id);
    
    if (!resource) {
      throw new Error('Resource not found');
    }
    
    return { ...resource };
  }

  async getByCategory(category) {
    if (!category) {
      throw new Error('Category is required');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.resources
      .filter(r => r.category === category)
      .map(r => ({ ...r }));
  }

  async search(query) {
    if (!query || typeof query !== 'string') {
      return this.getAll();
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    const searchTerm = query.toLowerCase();
    
    return this.resources
      .filter(resource => 
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.description.toLowerCase().includes(searchTerm) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .map(r => ({ ...r }));
  }

  async create(resourceData) {
    if (!resourceData || typeof resourceData !== 'object') {
      throw new Error('Invalid resource data');
    }

    const requiredFields = ['title', 'description', 'category', 'type', 'difficulty'];
    const missingFields = requiredFields.filter(field => !resourceData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    const newResource = {
      Id: this.nextId++,
      title: resourceData.title,
      description: resourceData.description,
      category: resourceData.category,
      type: resourceData.type,
      difficulty: resourceData.difficulty,
      readTime: resourceData.readTime || '5 min read',
      publishDate: new Date().toISOString(),
      tags: resourceData.tags || [],
      author: resourceData.author || 'Trifecta Team',
      url: resourceData.url || '#'
    };

    this.resources.push(newResource);
    return { ...newResource };
  }

  async update(id, updateData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid resource ID');
    }

    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Invalid update data');
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    const index = this.resources.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Resource not found');
    }

    // Don't allow ID changes
    const { Id, ...allowedUpdates } = updateData;
    
    this.resources[index] = {
      ...this.resources[index],
      ...allowedUpdates
    };

    return { ...this.resources[index] };
  }

  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid resource ID');
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    const index = this.resources.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error('Resource not found');
    }

    const deletedResource = { ...this.resources[index] };
    this.resources.splice(index, 1);
    
    return deletedResource;
  }

  async getCategories() {
    await new Promise(resolve => setTimeout(resolve, 100));
    const categories = [...new Set(this.resources.map(r => r.category))];
    return categories.sort();
  }

  async getDifficulties() {
    await new Promise(resolve => setTimeout(resolve, 100));
    const difficulties = [...new Set(this.resources.map(r => r.difficulty))];
    return ['Beginner', 'Intermediate', 'Advanced'].filter(d => difficulties.includes(d));
  }
}

export const educationalResourceService = new EducationalResourceService();