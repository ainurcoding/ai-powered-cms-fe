import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Label } from '../components/ui/Label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/Select';
import { usePost, useCreatePost, useUpdatePost } from '../hooks/usePosts';
import { useCategories } from '../hooks/useCategories';
import { useTags, usePopularTags, useCreateTag } from '../hooks/useTags';
import { KeywordInput } from '../components/ai/KeywordInput';
import { aiService } from '../services/ai.service';
import toast from 'react-hot-toast';
import type { CreatePostData, SEOOptimizationResponse } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/Dialog';

export const PostEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: post, isLoading: isLoadingPost } = usePost(id || '');
  const { data: categories } = useCategories();
  const { data: tags } = useTags();
  const { data: popularTags } = usePopularTags(5);
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const createTag = useCreateTag();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [categoryId, setCategoryId] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  // AI Generation states
  const [aiTopic, setAiTopic] = useState('');
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);
  const [aiContentType, setAiContentType] = useState<
    'tutorial' | 'blog' | 'article' | 'news' | 'review'
  >('blog');
  const [aiTone, setAiTone] = useState<
    'professional' | 'friendly' | 'casual' | 'technical' | 'creative'
  >('friendly');
  const [aiLength, setAiLength] = useState<'short' | 'medium' | 'long'>(
    'medium'
  );
  const [aiLanguage, setAiLanguage] = useState<'id' | 'en'>('id');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizingSEO, setIsOptimizingSEO] = useState(false);
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [seoOptimizationResult, setSeoOptimizationResult] =
    useState<SEOOptimizationResponse | null>(null);
  const [isSeoDialogOpen, setIsSeoDialogOpen] = useState(false);
  const [suggestedTagNames, setSuggestedTagNames] = useState<string[]>([]);

  // Load post data when editing
  useEffect(() => {
    if (isEditMode && post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setExcerpt(post.excerpt || '');
      setStatus(post.status || 'draft');
      setCategoryId(post.category_id || '');
      setSelectedTagIds(post.tags?.map((tag) => tag.id) || []);
      setMetaTitle(post.meta_title || '');
      setMetaDescription(post.meta_description || '');
      setMetaKeywords(post.meta_keywords || '');
    }
  }, [isEditMode, post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }

    const postData: CreatePostData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      status,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
      metaKeywords: metaKeywords.trim() || undefined,
      categoryId:
        categoryId && categoryId.trim() !== '' ? categoryId : undefined,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
    };

    try {
      if (isEditMode && id) {
        await updatePost.mutateAsync({ id, data: postData });
      } else {
        await createPost.mutateAsync(postData);
      }
      navigate('/posts');
    } catch {
      // Error already handled by hook
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSuggestedTagClick = async (tagName: string) => {
    // Cek apakah tag sudah ada di database
    const matchedTag = tags?.find(
      (tag) => tag.name.toLowerCase() === tagName.toLowerCase()
    );

    if (matchedTag) {
      // Tag sudah ada, toggle seperti biasa
      handleTagToggle(matchedTag.id);
    } else {
      // Tag belum ada, buat tag baru
      try {
        const newTag = await createTag.mutateAsync({ name: tagName });
        // Setelah tag dibuat, tambahkan ke selectedTagIds
        // Tags list akan otomatis di-refresh oleh useCreateTag hook
        setSelectedTagIds((prev) => {
          // Pastikan tidak duplicate
          if (prev.includes(newTag.id)) return prev;
          return [...prev, newTag.id];
        });
        toast.success(`Tag "${tagName}" berhasil dibuat dan ditambahkan!`);
      } catch {
        // Error sudah di-handle oleh hook
      }
    }
  };

  const handleGenerateContent = async () => {
    if (!aiTopic.trim()) {
      toast.error('Topic is required');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await aiService.generateContent({
        topic: aiTopic.trim(),
        keywords: aiKeywords.length > 0 ? aiKeywords : undefined,
        contentType: aiContentType,
        tone: aiTone,
        length: aiLength,
        language: aiLanguage,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        metaKeywords: metaKeywords.trim() || undefined,
      });

      // Auto-fill title, content, excerpt, dan meta fields
      if (response.title) {
        setTitle(response.title);
        setGeneratedTitle(response.title); // Simpan untuk optimize SEO
      }
      if (response.content) {
        setContent(response.content);
      }
      if (response.excerpt) {
        setExcerpt(response.excerpt);
      }
      if (response.metaDescription) {
        setMetaDescription(response.metaDescription);
      }
      if (response.metaTitle) {
        setMetaTitle(response.metaTitle);
      }
      if (response.metaKeywords) {
        setMetaKeywords(response.metaKeywords);
      }
      if (response.seoScore !== undefined) {
        setSeoScore(response.seoScore);
      }

      // Auto-select category jika ada suggestedCategory
      if (response.suggestedCategory && categories) {
        const matchedCategory = categories.find(
          (cat) =>
            cat.name.toLowerCase() === response.suggestedCategory?.toLowerCase()
        );
        if (matchedCategory) {
          setCategoryId(matchedCategory.id);
        }
      }

      // Simpan suggestedTags ke state (tidak auto-select, user pilih manual)
      if (response.suggestedTags) {
        setSuggestedTagNames(response.suggestedTags.slice(0, 5)); // Max 5 tags
      }

      // Auto-update/create post setelah generate content
      const postData: CreatePostData = {
        title: response.title || title.trim(),
        content: response.content || content.trim(),
        excerpt: response.excerpt || excerpt.trim() || undefined,
        status: 'draft', // Always draft after generate
        metaTitle: response.metaTitle || metaTitle.trim() || undefined,
        metaDescription:
          response.metaDescription || metaDescription.trim() || undefined,
        metaKeywords: response.metaKeywords || metaKeywords.trim() || undefined,
        categoryId:
          categoryId && categoryId.trim() !== '' ? categoryId : undefined,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      };

      if (isEditMode && id) {
        // Update existing post
        await updatePost.mutateAsync({ id, data: postData });
        toast.success('Content generated and post updated successfully!');
      } else {
        // Create new draft post
        const createdPost = await createPost.mutateAsync(postData);
        // Navigate to edit page of the newly created post
        if (createdPost?.id) {
          navigate(`/posts/${createdPost.id}/edit`);
          toast.success('Content generated and draft created successfully!');
        }
      }
    } catch (error) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimizeSEO = async () => {
    if (!content.trim()) {
      toast.error('Content is required to optimize SEO');
      return;
    }

    setIsOptimizingSEO(true);
    try {
      // Gunakan title dari generate-content response, atau dari field title jika tidak ada
      const titleToUse = generatedTitle || title;
      // Gunakan keywords dari user input (aiKeywords)
      const targetKeywords = aiKeywords.length > 0 ? aiKeywords : undefined;

      const response = await aiService.optimizeSEO(
        content,
        titleToUse,
        targetKeywords
      );

      // Simpan response untuk ditampilkan di dialog
      setSeoOptimizationResult(response);
      setIsSeoDialogOpen(true);
    } catch (error) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Failed to optimize SEO');
    } finally {
      setIsOptimizingSEO(false);
    }
  };

  const handleApproveSEOChanges = () => {
    if (!seoOptimizationResult) return;

    // Update title dengan optimizedTitle
    if (seoOptimizationResult.optimizedTitle) {
      setTitle(seoOptimizationResult.optimizedTitle);
    }

    // Update excerpt dengan metaDescription (atau bisa disesuaikan)
    if (seoOptimizationResult.metaDescription) {
      setExcerpt(seoOptimizationResult.metaDescription.substring(0, 200)); // Limit excerpt length
      setMetaDescription(seoOptimizationResult.metaDescription);
    }

    // Update meta title
    if (seoOptimizationResult.optimizedTitle) {
      setMetaTitle(seoOptimizationResult.optimizedTitle);
    }

    // Update meta keywords
    if (
      seoOptimizationResult.suggestedKeywords &&
      seoOptimizationResult.suggestedKeywords.length > 0
    ) {
      setMetaKeywords(seoOptimizationResult.suggestedKeywords.join(', '));
    }

    // Update SEO score
    if (seoOptimizationResult.seoScore !== undefined) {
      setSeoScore(seoOptimizationResult.seoScore);
    }

    setIsSeoDialogOpen(false);
    setSeoOptimizationResult(null);
    toast.success('SEO changes applied successfully!');
  };

  const handleRejectSEOChanges = () => {
    setIsSeoDialogOpen(false);
    setSeoOptimizationResult(null);
    toast('SEO changes rejected. Using previous values.', {
      icon: 'ℹ️',
    });
  };

  // Helper function untuk mendapatkan warna SEO score
  const getSeoScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getSeoScoreBgColor = (score: number | null) => {
    if (score === null) return 'bg-muted';
    if (score >= 80) return 'bg-green-500/10';
    if (score >= 60) return 'bg-yellow-500/10';
    if (score >= 40) return 'bg-orange-500/10';
    return 'bg-red-500/10';
  };

  const getSeoScoreLabel = (score: number | null) => {
    if (score === null) return 'N/A';
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  // Show loading only in edit mode when loading post data
  if (isEditMode && isLoadingPost) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? 'Edit post Anda di sini'
              : 'Buat post baru Anda di sini'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Title */}
              <Card>
                <CardHeader>
                  <CardTitle>Title</CardTitle>
                  <CardDescription>
                    Judul post Anda (wajib diisi)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Enter post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                  <CardDescription>
                    Isi konten post Anda (wajib diisi)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write your content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="min-h-[400px] font-mono text-sm"
                  />
                  <p className="text-muted-foreground mt-2 text-xs">
                    💡 Tip: Gunakan AI Content Generator di sidebar untuk
                    generate content otomatis
                  </p>
                </CardContent>
              </Card>

              {/* Excerpt */}
              <Card>
                <CardHeader>
                  <CardTitle>Excerpt</CardTitle>
                  <CardDescription>
                    Ringkasan singkat post Anda (opsional)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter post excerpt..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Content Generation */}
              <Card>
                <CardHeader>
                  <CardTitle>🤖 AI Content Generator</CardTitle>
                  <CardDescription>
                    Generate content dengan AI berdasarkan topic dan keywords
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ai-topic">Topic</Label>
                    <Input
                      id="ai-topic"
                      placeholder="e.g., Apa yang perlu dipelajari sebelum menikah"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ai-keywords">Keywords</Label>
                    <KeywordInput
                      keywords={aiKeywords}
                      onChange={setAiKeywords}
                      placeholder="Type keyword and press Enter..."
                      className="mt-2"
                      maxKeywords={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ai-content-type">Content Type</Label>
                    <Select
                      value={aiContentType}
                      onValueChange={(
                        value:
                          | 'tutorial'
                          | 'blog'
                          | 'article'
                          | 'news'
                          | 'review'
                      ) => setAiContentType(value)}
                    >
                      <SelectTrigger id="ai-content-type" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ai-tone">Tone</Label>
                    <Select
                      value={aiTone}
                      onValueChange={(
                        value:
                          | 'professional'
                          | 'friendly'
                          | 'casual'
                          | 'technical'
                          | 'creative'
                      ) => setAiTone(value)}
                    >
                      <SelectTrigger id="ai-tone" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ai-length">Length</Label>
                    <Select
                      value={aiLength}
                      onValueChange={(value: 'short' | 'medium' | 'long') =>
                        setAiLength(value)
                      }
                    >
                      <SelectTrigger id="ai-length" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ai-language">Language</Label>
                    <Select
                      value={aiLanguage}
                      onValueChange={(value: 'id' | 'en') =>
                        setAiLanguage(value)
                      }
                    >
                      <SelectTrigger id="ai-language" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    onClick={handleGenerateContent}
                    disabled={isGenerating || !aiTopic.trim()}
                    className="w-full"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Content'}
                  </Button>
                </CardContent>
              </Card>

              {/* Publish */}
              <Card>
                <CardHeader>
                  <CardTitle>Publish</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value: 'draft' | 'published') =>
                        setStatus(value)
                      }
                    >
                      <SelectTrigger id="status" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={createPost.isPending || updatePost.isPending}
                    >
                      {createPost.isPending || updatePost.isPending
                        ? 'Saving...'
                        : isEditMode
                          ? 'Update Post'
                          : 'Publish Post'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/posts')}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={categoryId || undefined}
                    onValueChange={setCategoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Popular Tags */}
                  <div>
                    <Label className="mb-2 text-sm font-semibold">
                      Popular Tags (5)
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {popularTags && popularTags.length > 0 ? (
                        popularTags.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleTagToggle(tag.id)}
                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm transition-colors ${
                              selectedTagIds.includes(tag.id)
                                ? 'bg-primary text-primary-foreground'
                                : 'border-input bg-background hover:bg-accent hover:text-accent-foreground border'
                            }`}
                          >
                            {tag.name}
                            {selectedTagIds.includes(tag.id) && ' ✓'}
                          </button>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No popular tags available
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Suggested Tags */}
                  <div>
                    <Label className="mb-2 text-sm font-semibold">
                      Suggested Tags (5)
                    </Label>
                    {suggestedTagNames.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {suggestedTagNames.map((tagName, index) => {
                          // Find matching tag from all tags
                          const matchedTag = tags?.find(
                            (tag) =>
                              tag.name.toLowerCase() === tagName.toLowerCase()
                          );
                          const isSelected = matchedTag
                            ? selectedTagIds.includes(matchedTag.id)
                            : false;

                          return (
                            <button
                              key={`suggested-${index}`}
                              type="button"
                              onClick={() => handleSuggestedTagClick(tagName)}
                              disabled={createTag.isPending}
                              className={`inline-flex items-center rounded-full px-3 py-1 text-sm transition-colors ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'border-input bg-background hover:bg-accent hover:text-accent-foreground border'
                              } ${createTag.isPending ? 'cursor-wait opacity-50' : ''}`}
                            >
                              {tagName}
                              {isSelected && ' ✓'}
                              {!matchedTag && !isSelected && ' +'}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        Generate content to get suggested tags
                      </p>
                    )}
                  </div>

                  {/* Selected Tags Display */}
                  {selectedTagIds.length > 0 && (
                    <div>
                      <Label className="mb-2 text-sm font-semibold">
                        Selected Tags ({selectedTagIds.length})
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedTagIds.map((tagId) => {
                          const tag = tags?.find((t) => t.id === tagId);
                          if (!tag) return null;
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => handleTagToggle(tag.id)}
                              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-colors"
                            >
                              {tag.name}
                              <span className="ml-1">×</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Optimasi untuk search engine
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* SEO Score Display */}
                  {seoScore !== null && (
                    <div
                      className={`rounded-lg border p-4 ${getSeoScoreBgColor(
                        seoScore
                      )}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm font-medium">
                            SEO Score
                          </p>
                          <p
                            className={`text-2xl font-bold ${getSeoScoreColor(
                              seoScore
                            )}`}
                          >
                            {seoScore}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-semibold ${getSeoScoreColor(
                              seoScore
                            )}`}
                          >
                            {getSeoScoreLabel(seoScore)}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            out of 100
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOptimizeSEO}
                    disabled={isOptimizingSEO || !content.trim()}
                    className="w-full"
                  >
                    {isOptimizingSEO ? 'Optimizing...' : '🤖 Optimize SEO'}
                  </Button>
                  <div>
                    <Label htmlFor="meta-title">Meta Title</Label>
                    <Input
                      id="meta-title"
                      placeholder="Meta title..."
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta-description">Meta Description</Label>
                    <Textarea
                      id="meta-description"
                      placeholder="Meta description..."
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta-keywords">Meta Keywords</Label>
                    <Input
                      id="meta-keywords"
                      placeholder="keyword1, keyword2, keyword3"
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      {/* SEO Optimization Dialog */}
      <Dialog open={isSeoDialogOpen} onOpenChange={setIsSeoDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review SEO Optimization</DialogTitle>
            <DialogDescription>
              Tinjau perubahan SEO yang disarankan. Anda dapat menyetujui atau
              menolak perubahan ini.
            </DialogDescription>
          </DialogHeader>

          {seoOptimizationResult && (
            <div className="space-y-4">
              {/* SEO Score */}
              <div
                className={`rounded-lg border p-4 ${getSeoScoreBgColor(
                  seoOptimizationResult.seoScore
                )}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      SEO Score
                    </p>
                    <p
                      className={`text-2xl font-bold ${getSeoScoreColor(
                        seoOptimizationResult.seoScore
                      )}`}
                    >
                      {seoOptimizationResult.seoScore}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${getSeoScoreColor(
                        seoOptimizationResult.seoScore
                      )}`}
                    >
                      {getSeoScoreLabel(seoOptimizationResult.seoScore)}
                    </p>
                    <p className="text-muted-foreground text-xs">out of 100</p>
                  </div>
                </div>
              </div>

              {/* Optimized Title */}
              <div>
                <Label className="text-sm font-semibold">Optimized Title</Label>
                <div className="bg-muted/50 mt-2 rounded-md border p-3">
                  <p className="text-sm">
                    {seoOptimizationResult.optimizedTitle}
                  </p>
                </div>
                {title !== seoOptimizationResult.optimizedTitle && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    Current: {title || '(empty)'}
                  </p>
                )}
              </div>

              {/* Meta Description */}
              <div>
                <Label className="text-sm font-semibold">
                  Meta Description
                </Label>
                <div className="bg-muted/50 mt-2 rounded-md border p-3">
                  <p className="text-sm">
                    {seoOptimizationResult.metaDescription}
                  </p>
                </div>
                {metaDescription !== seoOptimizationResult.metaDescription && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    Current: {metaDescription || '(empty)'}
                  </p>
                )}
              </div>

              {/* Suggested Keywords */}
              {seoOptimizationResult.suggestedKeywords &&
                seoOptimizationResult.suggestedKeywords.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold">
                      Suggested Keywords
                    </Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {seoOptimizationResult.suggestedKeywords.map(
                        (keyword, index) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium"
                          >
                            {keyword}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Improvements */}
              {seoOptimizationResult.improvements &&
                seoOptimizationResult.improvements.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold">
                      Suggested Improvements
                    </Label>
                    <ul className="mt-2 space-y-1">
                      {seoOptimizationResult.improvements.map(
                        (improvement, index) => (
                          <li
                            key={index}
                            className="text-muted-foreground flex items-start text-sm"
                          >
                            <span className="mr-2">•</span>
                            <span>{improvement}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleRejectSEOChanges}
            >
              Tidak, Gunakan yang Lama
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleApproveSEOChanges}
            >
              Ya, Terapkan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};
