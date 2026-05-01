
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Camera, Zap, AlertTriangle, Info } from "lucide-react";

export default function ARQuranPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null); // Ref to hold the MediaStream
  const { toast } = useToast();

  useEffect(() => {
    const startCamera = async () => {
      // It's important videoRef is available. If not, we can't attach stream.
      if (!videoRef.current) {
        console.warn("ARQuran: Video ref not available when trying to start camera. Aborting start.");
        // If videoRef is not there, we probably shouldn't be in an active state.
        // This might happen if the component unmounts rapidly after isCameraActive is set to true.
        setIsCameraActive(false); // Ensure we reflect that camera couldn't start
        return;
      }
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = mediaStream; // Store the stream

        // Check videoRef again, in case of rapid unmount between getUserMedia and here
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(playError => {
            console.error("ARQuran: Error attempting to play video:", playError);
            toast({
              variant: 'destructive',
              title: 'Video Playback Error',
              description: 'Could not automatically start the camera view. Please check site permissions.',
            });
          });
          setHasCameraPermission(true);
          toast({
            title: "Camera Access Granted",
            description: "AR Quran camera view is active (conceptual).",
          });
        } else {
           console.warn("ARQuran: Video ref became null after acquiring stream. Stopping acquired stream.");
           // If videoRef became null, stop the tracks of the stream we just got
           mediaStream.getTracks().forEach(track => track.stop());
           streamRef.current = null; // Also clear our streamRef
        }
      } catch (error) {
        console.error('ARQuran: Error accessing camera:', error);
        let description = 'Please enable camera permissions in your browser settings to use the AR Quran feature.';
        if ((error as Error).name === 'NotAllowedError') {
          description = 'Camera access was denied. Please enable camera permissions in your browser settings.';
        } else if ((error as Error).name === 'NotFoundError') {
          description = 'No camera was found on your device. This feature requires a camera.';
        } else if ((error as Error).name === 'NotReadableError') {
          description = 'The camera is already in use or cannot be accessed. Please ensure no other app is using it.';
        }
        toast({
          variant: 'destructive',
          title: 'Camera Access Issue',
          description: description,
        });
        
        // Ensure any acquired stream is stopped if an error occurred
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setHasCameraPermission(false);
        setIsCameraActive(false); // Turn off camera intent on error
      }
    };

    const stopCameraAndCleanup = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null; // Clear the stream ref
        console.log("ARQuran: Camera stream stopped and cleaned up via streamRef.");
      }
      if (videoRef.current) { // Attempt to clear srcObject if video element still exists
        videoRef.current.srcObject = null;
      }
      // Don't reset hasCameraPermission to true here, only to null or false
      // setHasCameraPermission(null); // Reset UI state for permission
    };

    if (isCameraActive) {
      startCamera();
    } else {
      // This block runs when isCameraActive is toggled to false OR on initial load if false.
      stopCameraAndCleanup();
      // Reset hasCameraPermission to null when camera is explicitly deactivated
      // or was never activated so the UI reflects "Attempting" or error correctly next time.
      if (hasCameraPermission !== false) { // Only reset if not explicitly denied/error
         setHasCameraPermission(null);
      }
    }

    // Cleanup function for when the component unmounts or isCameraActive changes
    return () => {
      console.log("ARQuran: useEffect cleanup triggered.");
      stopCameraAndCleanup();
    };
  }, [isCameraActive, toast]); // Only re-run if isCameraActive or toast changes

  const handleToggleCamera = () => {
    if (isCameraActive) {
        setIsCameraActive(false); // This will trigger the useEffect to call stopCameraAndCleanup
    } else {
        // Reset permission status BEFORE attempting to activate camera.
        setHasCameraPermission(null); 
        setIsCameraActive(true);    // This will trigger the useEffect to call startCamera
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="glass-card shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <Zap className="mr-3 h-8 w-8 text-primary" /> AR Quran Experience (Conceptual)
          </CardTitle>
          <CardDescription>
            Point your camera at a physical Quran page to see translations, tafsir, or hear recitations overlaid in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="default" className="bg-primary/10 border-primary/30">
            <Info className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary">Feature Under Development</AlertTitle>
            <AlertDescription>
              This Augmented Reality feature is a complex and exciting goal for Tahqeeq AI.
              Full implementation requires advanced image recognition and AR capabilities.
              The button below demonstrates camera permission handling, a first step for such a feature.
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <Button onClick={handleToggleCamera} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Camera className="mr-2 h-5 w-5" />
              {isCameraActive ? "Disable Camera View" : "Enable Camera for AR"}
            </Button>
          </div>
          
          {/* Video element is always in the DOM structure to keep videoRef stable, visibility controlled by parent or CSS */}
          <div className={`mt-6 border border-border/50 rounded-lg p-4 bg-background/30 ${isCameraActive ? 'block' : 'hidden'}`}>
            <video ref={videoRef} className="w-full aspect-video rounded-md shadow-inner bg-muted" autoPlay muted playsInline />
            
            {isCameraActive && hasCameraPermission === false && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Camera permission was denied or is unavailable. Please check your browser settings or ensure no other application is using the camera.
                  This AR feature cannot function without camera access.
                </AlertDescription>
              </Alert>
            )}
            {isCameraActive && hasCameraPermission === true && videoRef.current?.srcObject && (
              <div className="mt-4 text-center text-muted-foreground">
                <p>Camera feed active. (Conceptual: AR overlays would appear here)</p>
                <p className="text-xs">Point at a Quran page to see Kanzul Iman, Tafsir, or start recitation.</p>
              </div>
            )}
            {isCameraActive && hasCameraPermission === null && ( 
              <div className="mt-4 text-center text-muted-foreground">
                <p>Attempting to activate camera...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
