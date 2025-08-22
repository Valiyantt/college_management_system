using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;

namespace api.Services
{
    public class ItemService
    {
        private readonly AppDbContext _context;
        public ItemService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Item>> GetAllAsync() => await _context.Items.ToListAsync();
        public async Task<Item?> GetByIdAsync(int id) => await _context.Items.FindAsync(id);
        public async Task<Item> CreateAsync(Item item)
        {
            _context.Items.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }
        public async Task<bool> UpdateAsync(int id, Item updated)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null) return false;
            item.Name = updated.Name;
            item.Description = updated.Description;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null) return false;
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
