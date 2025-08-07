# Testing Checklist for Anemi

## 🧪 Stories Feature Testing

### ✅ Core Stories Functionality
- [ ] **Stories Listing Page** (`/stories`)
  - [ ] View all published stories
  - [ ] Story cards display correctly (title, excerpt, author, stats)
  - [ ] Like/unlike stories (requires login)
  - [ ] Share stories functionality
  - [ ] View count increments
  - [ ] Tags display correctly
  - [ ] Featured stories badge
  - [ ] Empty state when no stories

- [ ] **Individual Story Page** (`/stories/[id]`)
  - [ ] Story content displays correctly
  - [ ] Author information shows
  - [ ] Like/unlike functionality
  - [ ] Comment system works
  - [ ] Share functionality
  - [ ] View count increments
  - [ ] Tags display
  - [ ] Edit/delete buttons for author
  - [ ] Edit mode works (title, content, excerpt, tags, status)
  - [ ] Delete confirmation and functionality

- [ ] **Create Story Page** (`/stories/create`)
  - [ ] Form validation (title, content required)
  - [ ] Tag management (add/remove)
  - [ ] Draft vs Published status
  - [ ] Preview functionality
  - [ ] Save as draft
  - [ ] Publish story
  - [ ] Redirect to story page after creation

- [ ] **Dashboard Stories Section**
  - [ ] User's stories display in dashboard
  - [ ] Story management (view, edit, delete)
  - [ ] Story status badges
  - [ ] Quick stats (views, likes, comments)
  - [ ] Tags display
  - [ ] Empty state for new users

### ✅ API Endpoints Testing
- [ ] **GET /api/stories**
  - [ ] Returns published stories
  - [ ] Pagination works
  - [ ] Filtering by status
  - [ ] Filtering by featured
  - [ ] Filtering by tag
  - [ ] Filtering by author (including `authorId=me`)

- [ ] **POST /api/stories**
  - [ ] Creates new story
  - [ ] Validates required fields
  - [ ] Sets author correctly
  - [ ] Handles draft vs published status

- [ ] **GET /api/stories/[id]**
  - [ ] Returns individual story
  - [ ] Increments view count
  - [ ] Includes author and stats

- [ ] **PUT /api/stories/[id]**
  - [ ] Updates story (author only)
  - [ ] Validates ownership
  - [ ] Handles status changes
  - [ ] Sets publishedAt when publishing

- [ ] **DELETE /api/stories/[id]**
  - [ ] Soft deletes story (author only)
  - [ ] Validates ownership

- [ ] **POST /api/stories/[id]/like**
  - [ ] Creates like (authenticated users)
  - [ ] Prevents duplicate likes
  - [ ] Updates story like count

- [ ] **DELETE /api/stories/[id]/like**
  - [ ] Removes like
  - [ ] Updates story like count

- [ ] **GET /api/stories/[id]/comments**
  - [ ] Returns story comments
  - [ ] Includes author information
  - [ ] Handles pagination

- [ ] **POST /api/stories/[id]/comments**
  - [ ] Creates new comment (authenticated users)
  - [ ] Validates content
  - [ ] Includes author information

### ✅ Database Testing
- [ ] **Story Model**
  - [ ] All fields save correctly
  - [ ] Soft delete works
  - [ ] Relationships work (author, likes, comments)
  - [ ] Indexes perform well

- [ ] **StoryLike Model**
  - [ ] Unique constraint works
  - [ ] Cascade delete works
  - [ ] Relationship to story and user

- [ ] **StoryComment Model**
  - [ ] Soft delete works
  - [ ] Reply functionality works
  - [ ] Cascade delete works

### ✅ User Experience Testing
- [ ] **Authentication**
  - [ ] Login required for creating stories
  - [ ] Login required for liking stories
  - [ ] Login required for commenting
  - [ ] Author-only actions (edit/delete)

- [ ] **Responsive Design**
  - [ ] Mobile-friendly story cards
  - [ ] Mobile-friendly story pages
  - [ ] Mobile-friendly create form
  - [ ] Mobile-friendly dashboard

- [ ] **Error Handling**
  - [ ] Network errors
  - [ ] Validation errors
  - [ ] Permission errors
  - [ ] Not found errors

### ✅ Performance Testing
- [ ] **Page Load Times**
  - [ ] Stories listing loads quickly
  - [ ] Individual story pages load quickly
  - [ ] Dashboard loads quickly

- [ ] **Database Performance**
  - [ ] Queries are optimized
  - [ ] No N+1 queries
  - [ ] Proper indexing

### ✅ Security Testing
- [ ] **Authorization**
  - [ ] Users can only edit their own stories
  - [ ] Users can only delete their own stories
  - [ ] Users can only like once per story
  - [ ] Users can only comment when authenticated

- [ ] **Input Validation**
  - [ ] Story content is sanitized
  - [ ] Comment content is sanitized
  - [ ] Tags are validated
  - [ ] No SQL injection

### ✅ Integration Testing
- [ ] **With Existing Features**
  - [ ] Dashboard integration
  - [ ] User profile integration
  - [ ] Navigation integration
  - [ ] Email integration (if applicable)

### 🎯 Test Scenarios

#### Scenario 1: New User Creates First Story
1. Sign up/login
2. Go to `/stories/create`
3. Fill out form with title, content, tags
4. Save as draft
5. Edit and publish
6. Verify story appears in listing
7. Verify story appears in dashboard

#### Scenario 2: User Engages with Stories
1. Browse stories listing
2. Like a story
3. View individual story
4. Add a comment
5. Share story
6. Verify view count increases

#### Scenario 3: Author Manages Stories
1. Go to dashboard
2. View own stories
3. Edit a story
4. Change status from draft to published
5. Delete a story
6. Verify changes reflect everywhere

#### Scenario 4: Community Interaction
1. Multiple users create stories
2. Users like and comment on each other's stories
3. Verify like counts update
4. Verify comment threads work
5. Verify author permissions work correctly

---

## 🚀 Quick Test Commands

```bash
# Test API endpoints
curl http://localhost:3000/api/stories
curl http://localhost:3000/api/stories/story1
curl http://localhost:3000/api/stories/story1/comments

# Test database
npx prisma studio

# Run tests
npm run test

# Check for TypeScript errors
npx tsc --noEmit
```

## 📊 Success Criteria

- [ ] All stories functionality works end-to-end
- [ ] No console errors
- [ ] All API endpoints return correct responses
- [ ] Database operations work correctly
- [ ] User permissions work correctly
- [ ] UI is responsive and accessible
- [ ] Performance is acceptable (< 2s page loads)
- [ ] Security is maintained (no unauthorized access)

---

**Status: ✅ COMPLETE** - Stories feature is fully implemented and ready for testing! 