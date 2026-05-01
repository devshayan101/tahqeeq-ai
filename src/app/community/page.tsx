
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, MessageCircle, ThumbsUp, PlusCircle, Send, ShieldCheck, BellRing } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommunityPost {
  id: string;
  title: string;
  author: {
    name: string;
    avatarUrl: string;
    dataAiHint: string;
  };
  contentSnippet: string;
  timestamp: string;
  upvotes: number;
  commentsCount: number;
  category?: string;
}

const mockPosts: CommunityPost[] = [
  {
    id: "1",
    title: "Understanding the Concept of Tawassul in Light of Quran & Sunnah",
    author: { name: "Scholar Ahmad Qadri", avatarUrl: "https://placehold.co/100x100/7FDBFF/ffffff.png?text=AQ", dataAiHint: "scholar portrait" },
    contentSnippet: "Tawassul, or seeking intercession, is a topic often discussed. From an Ahl-e-Sunnat perspective, it is permissible and established through various proofs...",
    timestamp: "2 hours ago",
    upvotes: 152,
    commentsCount: 23,
    category: "Aqeedah",
  },
  {
    id: "2",
    title: "Recommended Adhkar for Morning and Evening",
    author: { name: "Student Fatima Rizvi", avatarUrl: "https://placehold.co/100x100/F012BE/ffffff.png?text=FR", dataAiHint: "student portrait" },
    contentSnippet: "What are some of the most emphasized Adhkar (remembrances) that we should recite in the morning and evening according to authentic Hadith?",
    timestamp: "5 hours ago",
    upvotes: 98,
    commentsCount: 12,
    category: "Tasawwuf",
  },
  {
    id: "3",
    title: "Fiqh Question: Ruling on Qada Salah (Missed Prayers)",
    author: { name: "Brother Usman Hanafi", avatarUrl: "https://placehold.co/100x100/2ECC40/ffffff.png?text=UH", dataAiHint: "person thinking" },
    contentSnippet: "I have some missed prayers from the past. What is the correct Hanafi method to make them up, and are there any specific times to avoid?",
    timestamp: "1 day ago",
    upvotes: 210,
    commentsCount: 45,
    category: "Fiqh",
  },
];

export default function CommunityForumPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const { toast } = useToast();

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        variant: "destructive",
        title: "Cannot Create Post",
        description: "Please provide both a title and content for your post.",
      });
      return;
    }
    // For demo: add to local state. In a real app, this would be an API call.
    const newPost: CommunityPost = {
      id: (posts.length + 1).toString(),
      title: newPostTitle,
      author: { name: "Current User (Demo)", avatarUrl: "https://placehold.co/100x100/FFDC00/000000.png?text=CU", dataAiHint: "user avatar" },
      contentSnippet: newPostContent.substring(0, 150) + (newPostContent.length > 150 ? "..." : ""),
      timestamp: "Just now",
      upvotes: 0,
      commentsCount: 0,
      category: "General",
    };
    setPosts([newPost, ...posts]);
    setShowCreatePostDialog(false);
    setNewPostTitle("");
    setNewPostContent("");
    toast({
      title: "Post Created!",
      description: "Your post has been successfully submitted (conceptual).",
    });
  };

  const handleUpvote = (postId: string) => {
    // Conceptual: In a real app, send API request and update state based on response
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      )
    );
    toast({ title: "Post Upvoted (Conceptual)", description: `You upvoted post ${postId}.` });
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="glass-card shadow-xl mb-8">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center text-3xl font-bold">
              <Users className="mr-3 h-8 w-8 text-primary" /> Community Forum
            </CardTitle>
            <CardDescription className="mt-1">
              Connect, discuss, and share insights on Islamic topics.
              <br />
              <span className="text-xs text-muted-foreground flex items-center mt-1">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                Discussions are conceptually AI-moderated to align with Sunni Hanafi principles.
                <BellRing className="h-3.5 w-3.5 ml-3 mr-1.5 text-amber-500" />
                Push notifications for replies are planned.
              </span>
            </CardDescription>
          </div>
          <Dialog open={showCreatePostDialog} onOpenChange={setShowCreatePostDialog}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] glass-card">
              <DialogHeader>
                <DialogTitle>Create a New Post</DialogTitle>
                <DialogDescription>
                  Share your question or insight with the community. Please adhere to community guidelines.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="post-title" className="text-right col-span-1 text-sm">Title</label>
                  <Input
                    id="post-title"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="col-span-3 bg-background/80"
                    placeholder="Enter your post title"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="post-content" className="text-right col-span-1 text-sm pt-2">Content</label>
                  <Textarea
                    id="post-content"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="col-span-3 min-h-[120px] bg-background/80"
                    placeholder="Share your thoughts, questions, or insights..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreatePostDialog(false)}>Cancel</Button>
                <Button onClick={handleCreatePost} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Send className="mr-2 h-4 w-4" /> Submit Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      {posts.length === 0 ? (
        <Card className="glass-card shadow-lg">
          <CardContent className="p-10 text-center text-muted-foreground">
            <MessageCircle className="h-16 w-16 mx-auto mb-4" />
            <p className="text-xl">No posts yet.</p>
            <p>Be the first to start a discussion!</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-18rem)] pr-3"> {/* Adjust height as needed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="glass-card shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10 border-2 border-primary/30">
                      <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint={post.author.dataAiHint} />
                      <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{post.author.name}</p>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </div>
                  <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                    {/* In a real app, this would link to the post detail page */}
                    {post.title}
                  </CardTitle>
                  {post.category && <Badge variant="secondary" className="mt-1 w-fit">{post.category}</Badge>}
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">{post.contentSnippet}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center text-sm text-muted-foreground pt-3">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="hover:bg-accent/10 p-1.5 h-auto" onClick={() => handleUpvote(post.id)}>
                      <ThumbsUp className="mr-1.5 h-4 w-4 text-green-500" /> {post.upvotes}
                    </Button>
                    <div className="flex items-center">
                      <MessageCircle className="mr-1.5 h-4 w-4 text-blue-500" /> {post.commentsCount}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast({title: "Conceptual", description:"This would navigate to the full post view."})}>
                    View Post
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

    